import { Token } from "./Token"

export interface SwapConfig {
  tokenA: Token
  tokenB: Token
  amountToSwap: number
  configId?: string
}
