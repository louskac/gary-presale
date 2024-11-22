import { HexAddress, SupportedChains, SupportedTokens } from "@/types";

const COINGARAGE_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_COINGARAGE_ADDRESS as `0x${string}`;
const USDC_POLYGON_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDC_POLYGON_CONTRACT_ADDRESS as `0x${string}`;
const USDC_ETHEREUM_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDC_ETHEREUM_CONTRACT_ADDRESS as `0x${string}`;
const USDC_BSC_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDC_BSC_CONTRACT_ADDRESS as `0x${string}`;
const USDT_POLYGON_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDT_POLYGON_CONTRACT_ADDRESS as `0x${string}`;
const USDT_ETHEREUM_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDT_ETHEREUM_CONTRACT_ADDRESS as `0x${string}`;
const USDT_BSC_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_USDT_BSC_CONTRACT_ADDRESS as `0x${string}`;
const ETH_ETH_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_ETH_ETH_CONTRACT_ADDRESS as `0x${string}`;

export type ContractAddresses = {
  [token in SupportedTokens]: {
    [chain in SupportedChains]: HexAddress;
  };
};

export const contractAddresses: ContractAddresses = {
  USDC: {
    Polygon: USDC_POLYGON_CONTRACT_ADDRESS,
    Ethereum: USDC_ETHEREUM_CONTRACT_ADDRESS,
    "BNB Smart Chain": USDC_BSC_CONTRACT_ADDRESS,
  },
  USDT: {
    Polygon: USDT_POLYGON_CONTRACT_ADDRESS,
    Ethereum: USDT_ETHEREUM_CONTRACT_ADDRESS,
    "BNB Smart Chain": USDT_BSC_CONTRACT_ADDRESS,
  },
  ETH: {
    Ethereum: ETH_ETH_CONTRACT_ADDRESS,
  },
};

export const getUsdcOnChain = (chain: any) => {
  switch (chain) {
    case "Polygon":
      return USDC_POLYGON_CONTRACT_ADDRESS;
    case "Ethereum":
      return USDC_ETHEREUM_CONTRACT_ADDRESS;
    case "BNB Smart Chain":
      return USDC_BSC_CONTRACT_ADDRESS;
    default:
      return USDC_POLYGON_CONTRACT_ADDRESS;
  }
};