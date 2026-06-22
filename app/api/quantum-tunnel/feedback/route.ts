import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { Contract, JsonRpcProvider, getAddress, isAddress, verifyMessage } from "ethers";
import {
  BASE_RPC_URL,
  ERC721_BALANCE_ABI,
  SOUL_DEED_CONTRACT_ADDRESS,
  createFeedbackSignMessage,
  feedbackCategories,
  soulDeedChain,
  type Address,
  type FeedbackCategory,
} from "../../../../lib/soulDeedGate";

type FeedbackPayload = {
  category?: string;
  message?: string;
  nonce?: string;
  rating?: number;
  signature?: string;
  signedMessage?: string;
  timestamp?: number;
  walletAddress?: string;
};

type StoredFeedback = {
  category: FeedbackCategory;
  chainId: number;
  contractAddress: Address;
  createdAt: string;
  message: string;
  rating: number | null;
  walletAddress: Address;
};

const MAX_MESSAGE_LENGTH = 1200;
const MIN_MESSAGE_LENGTH = 12;
const SIGNATURE_MAX_AGE_MS = 10 * 60 * 1000;
const rateLimit = new Map<string, number[]>();

const publicProvider = new JsonRpcProvider(BASE_RPC_URL, soulDeedChain.id);

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function normalizeCategory(value: string | undefined): FeedbackCategory | null {
  if (!value || !feedbackCategories.includes(value as FeedbackCategory)) {
    return null;
  }

  return value as FeedbackCategory;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const recent = (rateLimit.get(key) ?? []).filter((entry) => entry > windowStart);

  if (recent.length >= 5) {
    return false;
  }

  recent.push(now);
  rateLimit.set(key, recent);
  return true;
}

async function storeFeedback(record: StoredFeedback) {
  const webhookUrl = process.env.QT_FEEDBACK_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error("Feedback webhook rejected the record.");
    }

    return;
  }

  const storageRoot =
    process.env.QT_FEEDBACK_STORAGE_DIR ??
    (process.env.VERCEL ? "/tmp/alliant-feedback" : path.join(process.cwd(), ".data"));
  await mkdir(storageRoot, { recursive: true });
  await appendFile(path.join(storageRoot, "quantum-tunnel-feedback.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
}

export async function POST(request: Request) {
  let payload: FeedbackPayload;

  try {
    payload = (await request.json()) as FeedbackPayload;
  } catch {
    return jsonError("Invalid request body.");
  }

  const category = normalizeCategory(payload.category);
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const nonce = typeof payload.nonce === "string" ? payload.nonce : "";
  const signature = typeof payload.signature === "string" ? payload.signature : "";
  const signedMessage = typeof payload.signedMessage === "string" ? payload.signedMessage : "";
  const timestamp = typeof payload.timestamp === "number" ? payload.timestamp : 0;

  if (!category) {
    return jsonError("Choose a valid feedback category.");
  }

  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return jsonError(`Feedback must be ${MIN_MESSAGE_LENGTH}-${MAX_MESSAGE_LENGTH} characters.`);
  }

  if (!payload.walletAddress || !isAddress(payload.walletAddress)) {
    return jsonError("Valid wallet address required.");
  }

  if (!nonce || nonce.length > 80 || !signature.startsWith("0x")) {
    return jsonError("Valid wallet signature required.");
  }

  if (!timestamp || Math.abs(Date.now() - timestamp) > SIGNATURE_MAX_AGE_MS) {
    return jsonError("Signature expired. Please sign again.");
  }

  const walletAddress = getAddress(payload.walletAddress) as Address;
  const expectedSignedMessage = createFeedbackSignMessage({
    category,
    message,
    nonce,
    timestamp,
    walletAddress,
  });

  if (signedMessage !== expectedSignedMessage) {
    return jsonError("Signed message does not match this feedback.");
  }

  const rateKey = walletAddress.toLowerCase();
  if (!checkRateLimit(rateKey)) {
    return jsonError("Too many submissions from this wallet. Try again later.", 429);
  }

  const recoveredAddress = getAddress(verifyMessage(expectedSignedMessage, signature));
  const signatureMatches = recoveredAddress === walletAddress;

  if (!signatureMatches) {
    return jsonError("Wallet signature did not match the submitted address.", 401);
  }

  const soulDeedContract = new Contract(SOUL_DEED_CONTRACT_ADDRESS, ERC721_BALANCE_ABI, publicProvider);
  const balance = (await soulDeedContract.balanceOf(walletAddress)) as bigint;

  if (balance <= BigInt(0)) {
    return jsonError("Soul Deed not found in this wallet.", 403);
  }

  await storeFeedback({
    category,
    chainId: soulDeedChain.id,
    contractAddress: SOUL_DEED_CONTRACT_ADDRESS,
    createdAt: new Date().toISOString(),
    message,
    rating: typeof payload.rating === "number" && payload.rating >= 1 && payload.rating <= 5 ? payload.rating : null,
    walletAddress,
  });

  return NextResponse.json({
    ok: true,
    message: "Feedback recorded. Thank you for helping tune the Tunnel.",
  });
}
