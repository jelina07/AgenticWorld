const ENV = process.env.NEXT_PUBLIC_ENV || "dev";

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

export const AIRDROP_ADDRESS = AIRDROP_ADDRESS_CONFIG[ENV];

export const AGENT1_ADDRESS_CONFIG: Record<string, { chainId: number; address: `0x${string}` }> = {
  dev: {
    chainId: 192940,
    address: "0x1c977CDe8F15620C793e0F28b03c59985c04A0E2",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const AGENT1_ADDRESS = AGENT1_ADDRESS_CONFIG[ENV];

export const DAOKEN_ADDRESS_CONFIG: Record<string, { chainId: number; address: `0x${string}` }> = {
  dev: {
    chainId: 192940,
    address: "0x7904d6914C538c642Fe58bd47Bb9BAA387C59557",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const DAOKEN_ADDRESS = DAOKEN_ADDRESS_CONFIG[ENV];

export const MEMBER_POOL_ADDRESS_CONFIG: Record<string, { chainId: number; address: `0x${string}` }> = {
  dev: {
    chainId: 192940,
    address: "0x217F5e767D5Ab028e8ae00e6148e0484Dc0C7504",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const MEMBER_POOL_ADDRESS = MEMBER_POOL_ADDRESS_CONFIG[ENV];

export const DAO_INSPECTOR_CONFIG: Record<string, { chainId: number; address: `0x${string}` }> = {
  dev: {
    chainId: 192940,
    address: "0x8E92bAFe40040b8D14e6B0911fD12d61b50393E0",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const DAO_INSPECTOR_ADDRESS = DAO_INSPECTOR_CONFIG[ENV];
