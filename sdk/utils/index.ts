export const DEV = "dev";
export const PROD = "prod";
export const MAINNETIO = "mainnetio";
export const MAINNET = "mainnet";

export const isDev = () => process.env.NEXT_PUBLIC_ENV === DEV;
export const isProd = () => process.env.NEXT_PUBLIC_ENV === PROD;
export const isMainnetio = () => process.env.NEXT_PUBLIC_ENV === MAINNETIO;
export const isMainnet = () => process.env.NEXT_PUBLIC_ENV === MAINNET;
