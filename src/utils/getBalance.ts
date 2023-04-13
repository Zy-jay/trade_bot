import { ethers } from "ethers";
import { RPS_URLS } from "../constants/chains";

const provider =  new ethers.providers.JsonRpcProvider(RPS_URLS[97]
        
      );
export async function getNativeBalance(address: string) {
  const balance = await provider.getBalance(address)
  

  return (Number(balance) / 10 ** 18 )

    
}