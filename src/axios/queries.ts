import { apiClient } from "./client";

export async function getWalletsFromDb(signature: string, address: string) {
  const userWallets = await apiClient.get(
    `signMesage/login?signature=${signature}&address=${address}`
  );

  return userWallets;
}

export async function getUserWalletsFromDb( address?: string) {
  if(!address) return []
  const userWallets = await apiClient.get(
    `getUserWallets?address=${address}`
  );

  return userWallets.data;
}

export async function addTokenToDb(address: string, chainId: number, url?: string) {
  const token = await apiClient.post(
    `addToken`, {
      address,
      chainId,
      url,
    }
  );
  return token.data;
}

export async function createNewWallet(address: string, name?: string) {
  const wallet = await apiClient.post(`newWallet`, { address, name });
  return wallet;
}

export async function getAllTokensFromDb() {
  const token = await apiClient.get(`allTokens`);
  return token.data;
}

export async function saveTradeConfig(
  userAddress: string,
  tokenAaddress: string,
  tokenBaddress: string,
  name: string,
  amountToSwap: number,
  timeInterval: number
) {
  const config = await apiClient.post(`addTradeConfig`, {
    userAddress,
    tokenAaddress,
    tokenBaddress,
    amountToSwap,
    timeInterval,
    name,
  });
  return config;
}

export async function getUserConfigsFromDb(address: string) {
  const configs = await apiClient.get(`getConfigs?address=${address}`);
  return configs.data;
}

export async function getUserSwapProcesses(userAddress: string) {
  const processes = await apiClient.get(`userProcesses?address=${userAddress}`);
  return processes;
}

export async function startTradeProcess(
  // signature: string,
  // message: string,
  userAddres: string,
  configId: number
) {
  const processes = await apiClient.post(`startProcess`, {
    // signature,
    // message,
    userAddres,
    configId,
  });
  return processes.data;
}

export async function stopTradeProcess(processId: number) {
  const processes = await apiClient.post(`stopProcess`, {
    processId,
  });

  if (processes.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function getUserProcess(processId: number) {
  const processes = await apiClient.post(`getUserProcess`, {
    processId,
  });
  return processes.data

  // if (processes.status === 200) {
  //   return true;
  // } else {
  //   return false;
  // }
}

export async function addTradeConfigToDb(
  userAddress: string,
  tokenAaddress: string,
  tokenBaddress: string,
  amountToSwap: number,
  timeInterval: number,
  name: string,
  walletAddress: string
) {
  const config = await apiClient.post(`addTradeConfig`, {
    userAddress,
    tokenAaddress,
    tokenBaddress,
    amountToSwap,
    timeInterval,
    name,
    walletAddress

  });
  return config.data;
}
