"use client";

import { useMemo, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, getAddress, isAddress } from "ethers";
import {
  BASE_RPC_URL,
  ERC721_BALANCE_ABI,
  SOUL_DEED_CHAIN_ID,
  SOUL_DEED_CONTRACT_ADDRESS,
  createFeedbackSignMessage,
  feedbackCategories,
  type Address,
  type FeedbackCategory,
} from "../lib/soulDeedGate";

type EthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const categoryLabels: Record<FeedbackCategory, string> = {
  rules: "Rules",
  balance: "Balance",
  story: "Story",
  visual: "Visual",
  card: "Card",
  bug: "Bug",
  other: "Other",
};

function getWalletProvider() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.ethereum;
}

async function switchToBase(provider: EthereumProvider) {
  const chainIdHex = `0x${SOUL_DEED_CHAIN_ID.toString(16)}`;

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? (error as { code?: number }).code : undefined;

    if (code !== 4902) {
      throw error;
    }

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: chainIdHex,
          chainName: "Base",
          nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
          rpcUrls: [BASE_RPC_URL],
          blockExplorerUrls: ["https://basescan.org"],
        },
      ],
    });
  }
}

export function SoulDeedFeedbackGate() {
  const publicProvider = useMemo(() => new JsonRpcProvider(BASE_RPC_URL, SOUL_DEED_CHAIN_ID), []);

  const [walletAddress, setWalletAddress] = useState<Address | null>(null);
  const [status, setStatus] = useState<"idle" | "checking" | "eligible" | "locked" | "submitting" | "submitted" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("rules");
  const [rating, setRating] = useState("4");
  const [notice, setNotice] = useState("Connect the wallet that holds your Soul Deed.");

  async function connectAndCheck() {
    const provider = getWalletProvider();

    if (!provider) {
      setStatus("error");
      setNotice("No browser wallet was found. Open this page in a wallet-enabled browser.");
      return;
    }

    setStatus("checking");
    setNotice("Checking Soul Deed access on Base.");

    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const firstAccount = Array.isArray(accounts) && typeof accounts[0] === "string" ? accounts[0] : "";

      if (!isAddress(firstAccount)) {
        throw new Error("Wallet did not return a valid address.");
      }

      const address = getAddress(firstAccount) as Address;
      setWalletAddress(address);
      await switchToBase(provider);

      const soulDeedContract = new Contract(SOUL_DEED_CONTRACT_ADDRESS, ERC721_BALANCE_ABI, publicProvider);
      const balance = (await soulDeedContract.balanceOf(address)) as bigint;

      if (balance > BigInt(0)) {
        setStatus("eligible");
        setNotice("Access confirmed. This wallet holds a Soul Deed.");
      } else {
        setStatus("locked");
        setNotice("No Soul Deed found in this wallet.");
      }
    } catch (error) {
      setStatus("error");
      setNotice(error instanceof Error ? error.message : "Wallet access check failed.");
    }
  }

  async function submitFeedback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const provider = getWalletProvider();
    const trimmedMessage = message.trim();

    if (!provider || !walletAddress || status !== "eligible") {
      setStatus("error");
      setNotice("Reconnect an eligible Soul Deed wallet before submitting.");
      return;
    }

    if (trimmedMessage.length < 12) {
      setNotice("Leave a little more detail so the idea can be reviewed.");
      return;
    }

    setStatus("submitting");
    setNotice("Requesting wallet signature.");

    try {
      const timestamp = Date.now();
      const nonce = crypto.randomUUID();
      const signedMessage = createFeedbackSignMessage({
        category,
        message: trimmedMessage,
        nonce,
        timestamp,
        walletAddress,
      });

      const browserProvider = new BrowserProvider(provider);
      const signer = await browserProvider.getSigner(walletAddress);
      const signature = await signer.signMessage(signedMessage);

      setNotice("Submitting holder feedback.");

      const response = await fetch("/api/quantum-tunnel/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          message: trimmedMessage,
          nonce,
          rating: Number(rating),
          signature,
          signedMessage,
          timestamp,
          walletAddress,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Feedback was not accepted.");
      }

      setMessage("");
      setStatus("submitted");
      setNotice(result.message ?? "Feedback recorded. Thank you for helping tune the Tunnel.");
    } catch (error) {
      setStatus("eligible");
      setNotice(error instanceof Error ? error.message : "Feedback submission failed.");
    }
  }

  const walletLabel = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "No wallet connected";
  const isEligible = status === "eligible" || status === "submitting" || status === "submitted";

  return (
    <section className="soul-deed-gate" id="feedback" aria-label="Soul Deed feedback gate">
      <div className="board-heading">
        <p className="section-label">Soul Deed feedback gate</p>
        <h2>Holder Idea Box</h2>
      </div>
      <div className="gate-access-panel">
        <div>
          <span>Access</span>
          <strong>{walletLabel}</strong>
          <p>{notice}</p>
        </div>
        <button type="button" onClick={connectAndCheck} disabled={status === "checking" || status === "submitting"}>
          {status === "checking" ? "Checking" : walletAddress ? "Recheck Soul Deed" : "Connect Wallet"}
        </button>
      </div>

      {status === "locked" ? (
        <div className="gate-locked-note">
          <strong>Soul Deed access required.</strong>
          <p>
            Feedback submissions are open to wallets that currently hold a Soul Deed. If the Deed is in another wallet,
            connect that one.
          </p>
          <a href="https://www.sovengine.xyz/portal">Enter Sovereign Engine</a>
        </div>
      ) : null}

      {isEligible ? (
        <form className="feedback-form" onSubmit={submitFeedback}>
          <label>
            <span>Idea type</span>
            <select value={category} onChange={(event) => setCategory(event.target.value as FeedbackCategory)}>
              {feedbackCategories.map((option) => (
                <option key={option} value={option}>
                  {categoryLabels[option]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Rating</span>
            <select value={rating} onChange={(event) => setRating(event.target.value)}>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label className="feedback-form__message">
            <span>Feedback</span>
            <textarea
              maxLength={1200}
              minLength={12}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Leave a rule, card, balance, story, or visual idea."
              value={message}
            />
          </label>
          <p>
            Submitting stores your wallet address with your message. Never enter seed phrases, private keys, or personal
            financial details.
          </p>
          <button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting" : "Submit Feedback"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
