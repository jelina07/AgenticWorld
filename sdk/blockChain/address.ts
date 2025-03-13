export const AIRDROP_ADDRESS_CONFIG: Record<string, { chainId: number; address: `0x${string}` }> = {
  dev: {
    chainId: 192940,
    address: "0x4bf96BabF3502a6bdf57083B8Be5f4192CC1aD7b",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const AIRDROP_ADDRESS = AIRDROP_ADDRESS_CONFIG[process.env.NEXT_PUBLIC_ENV || "dev"];
