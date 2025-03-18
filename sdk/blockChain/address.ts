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
    address: "0x7A110e595a9fE807A2F03412a8Ba3F3D65397C91",
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
    address: "0xD63BbCc27648A84C0E6D7E25BcD98bBc7dA6B753",
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
    address: "0x45d651dF33773C2e13E0fd7a4C5490c2C51BcC3e",
  },
  prod: {
    chainId: 228,
    address: "0x",
  },
} as const;

export const DAO_INSPECTOR_ADDRESS = DAO_INSPECTOR_CONFIG[ENV];
