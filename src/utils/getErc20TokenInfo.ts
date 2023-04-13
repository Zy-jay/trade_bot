import { ethers } from "ethers";
import { RPS_URLS } from "../constants/chains";
import WETH_ABI from "../abis/weth.json";
import { useMemo } from "react";

export async function getErc20Contract(address: string, chainId: number) {
  if (chainId !== 97) return;
  const provider = new ethers.providers.JsonRpcProvider(RPS_URLS[chainId]);
  const erc20Contract = new ethers.Contract(address, WETH_ABI, provider);
  return erc20Contract;
}

export async function getTokenInfo(address: string, chainId: number) {
  const contract = await getErc20Contract(address, chainId);
//   if (!contract) {
//     return console.error("No Contract");
//   }
  const decimals: number = await contract?.decimals();
  const symbol: string = await contract?.symbol();
  
    return { decimals, symbol };

}
