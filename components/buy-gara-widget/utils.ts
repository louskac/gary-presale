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
    "Polygon": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    "Sepolia": "0x9c47394eD6ba28EC5336d3197416dF95c5A632eB",
    "Binance Smart Chain Testnet": "0x77e578B49a0a5bCa5c22520eae5e5FE40480944a",
  },
  USDT: {
    "Polygon": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    "Sepolia": "0x34Bb47732aF26EC7fF493a49694342945090a7F7",
    "Binance Smart Chain Testnet": "0xD4da7413C8fd983689E0F5fb7311EFf3d3A4E5FD",
  },
  ETH: {
    "Sepolia": "0x34Bb47732aF26EC7fF493a49694342945090a7F7",
  },
  POL: {
    "Polygon": "0x34Bb47732aF26EC7fF493a49694342945090a7F7",
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