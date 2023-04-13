import { Card } from "antd"
import { useState } from "react"
import { chainsBlockScanUrl } from "../../constants/chains"
import { getNativeBalance } from "../../utils/getBalance"
import { getShortAddress } from "../../utils/getShortAddress"

export const WalletItem = (props: any) => {
  const {item} = props
 const [nativeBalance, setNativeBalance] = useState(0)
 async function getBalances() {
    await getNativeBalance(item.walletAddress).then(res => setNativeBalance(res))    
 }
 getBalances()


  return (
    <Card
    title={item.walletName}
    bordered={true}
    style={{ width: 300 }}
  >
    <a href={(chainsBlockScanUrl[97] + "address/" + item.walletAddress).toString()} target="Blanck" >{getShortAddress(item.walletAddress)}</a>
    <p>{"Balance: " + nativeBalance.toFixed(4) + " BNB"}</p>
  </Card>
  )
}