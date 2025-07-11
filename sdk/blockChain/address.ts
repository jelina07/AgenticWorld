import { Address } from "viem";

export const AIRDROP_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x1d297979fd76058F7Cc1E0AB5D2105268a9BCE10",
  228: "0x",
  97: "0x39825a723991f8f90f5575eE0C18031275D95b66",
  56: "0x",
};
export const AGENT1_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x4a412444Bb9BC6f83478cd593fB7b9EB1e4bB3C3",
  228: "0xdeD96288c99145da4800f55355A2466f6238fBBE",
  97: "0x9ac1C5F558a06F07bE122D66170C835b9e442602",
  56: "0xb080B94052f039eC2CA8BBaF7Ec13329d1926973",
};

export const DAOKEN_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x33581174971727Cf00cf4c89afb9A0aacF5BE006",
  228: "0xd55C9fB62E176a8Eb6968f32958FeFDD0962727E",
  97: "0x6Be9d2F754CAF73187ffb5f526a38C6E4d135e19",
  56: "0xd55C9fB62E176a8Eb6968f32958FeFDD0962727E",
};

export const MEMBER_POOL_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x9298f84edDf128C3c7FBc4726cA9d18C649230Ff",
  228: "0xe8451dC0959469e42F2679b3eC085e58FB212b11",
  97: "0xD4C46175Dea45Cc3E6475E9beBD567806D7e623D",
  56: "0x1987d8109638A028BB8bE654531B15642a8708E3",
};

export const DAO_INSPECTOR_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x9dD8B59d58b370048A25919fcd48A87F6109a5F0",
  228: "0xB53cbFeA69e00a0826A96D189825dc2a4faDaF31",
  97: "0xBdE1490371f747f879714812A9966368E8CD7803",
  56: "0x4014fF74BA6eCbbecA4b2118B20cff0732566436",
};

export const FAUCET_ADDRESS: Record<number, `0x${string}`> = {
  97: "0xE26A3a0Ff34C8fad368B9F01Fce9209b2076A2B2",
};

export const AGENT_SIGVERIFY_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x5447aCAF5b14a47F6327081DcEF5EA1E56329978",
  228: "0x7753E222B1bedA128Fe80151861EB30169DE2F4e",
};

export const WORLAIHEALTHY_HUB_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x865CB24625741AddC482321fd9DeBD0c4dE2F992",
  228: "0x084D64cd539993121FA979578BB0631EbadD6e2e",
  97: "0x6E5e6ba629fE6857C55b1c33389B0f153a287494",
  56: "0x3aa0bc0182209C37f52A512E119CFE663f014398",
};

export const DEEPSEEK_HUB_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x5956B28d53B74CcEDb3791Dc6E79f793371f5Ec8",
  228: "0x6cA48342b70ea382Ab9FCdf7C0E4073eA10850C6",
};

export const FHEKEY_REGISTRY_ADDRESS: Record<number, `0x${string}`> = {
  192940: "0x350D2819Df60aDE1D074EdB11f7900dDDA068Ab5",
  228: "0xA0006842E14313EBef80Bf74cE1803fE6f1Baf3B",
};

const vanaContracts = ["DataRegistryProxy", "TeePoolProxy", "DataLiquidityPoolProxy", "vanaReward"] as const;
export type VanaContract = (typeof vanaContracts)[number];

const addresses: Record<number, Record<VanaContract, Address>> = {
  // Moksha Testnet
  14800: {
    DataRegistryProxy: "0x8C8788f98385F6ba1adD4234e551ABba0f82Cb7C",
    TeePoolProxy: "0xE8EC6BD73b23Ad40E6B9a6f4bD343FAc411bD99A",
    DataLiquidityPoolProxy: "0x832674060C0e96ca4Dc901FA1C2dB02dB7da9435",
    vanaReward: "0x13Ba1ca581186ad3443939531A6eb91EA0eFe39c",
  },
  // Mainnet
  1480: {
    DataRegistryProxy: "0x8C8788f98385F6ba1adD4234e551ABba0f82Cb7C",
    TeePoolProxy: "0xE8EC6BD73b23Ad40E6B9a6f4bD343FAc411bD99A",
    DataLiquidityPoolProxy: "0xb917102F6e1F192be9FA9E70977a5A6454f68EAA",
    vanaReward: "0x4814579e7C7a9d227f516d3D888A2734a758F7EC",
  },
};

export const getContractAddress = (chainId: number, contract: VanaContract) => {
  const contractAddress = addresses[chainId]?.[contract];
  if (!contractAddress) {
    throw new Error(`Contract address not found for ${contract} on chain ${chainId}`);
  }
  return contractAddress;
};
