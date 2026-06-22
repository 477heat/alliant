export type Address = `0x${string}`;

export const SOUL_DEED_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_SOUL_DEED_CHAIN_ID ?? "8453",
);

export const SOUL_DEED_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_SOUL_DEED_CONTRACT_ADDRESS ??
  "0x2df9151c4e32082a05c686bd3092180134d17deb"
) as Address;

export const FEEDBACK_SIGNING_DOMAIN =
  process.env.NEXT_PUBLIC_FEEDBACK_SIGNING_DOMAIN ?? "alliantstudio.xyz";

export const BASE_RPC_URL =
  process.env.NEXT_PUBLIC_BASE_RPC_URL ??
  process.env.BASE_RPC_URL ??
  "https://mainnet.base.org";

export const soulDeedChain = {
  id: SOUL_DEED_CHAIN_ID,
  name: "Base",
  nativeCurrency: { decimals: 18, name: "Ether", symbol: "ETH" },
  rpcUrls: {
    default: {
      http: [BASE_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  },
} as const;

export const ERC721_BALANCE_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const feedbackCategories = [
  "rules",
  "balance",
  "story",
  "visual",
  "card",
  "bug",
  "other",
] as const;

export type FeedbackCategory = (typeof feedbackCategories)[number];

export type FeedbackSignMessageInput = {
  category: FeedbackCategory;
  message: string;
  nonce: string;
  timestamp: number;
  walletAddress: Address;
};

export function createFeedbackSignMessage({
  category,
  message,
  nonce,
  timestamp,
  walletAddress,
}: FeedbackSignMessageInput) {
  return [
    "Quantum Tunnel feedback submission",
    `Domain: ${FEEDBACK_SIGNING_DOMAIN}`,
    `Wallet: ${walletAddress}`,
    `Soul Deed Contract: ${SOUL_DEED_CONTRACT_ADDRESS}`,
    `Chain ID: ${SOUL_DEED_CHAIN_ID}`,
    `Category: ${category}`,
    `Timestamp: ${timestamp}`,
    `Nonce: ${nonce}`,
    "",
    "Message:",
    message,
  ].join("\n");
}
