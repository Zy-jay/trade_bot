import { Button, Card } from "antd";
import { useState } from "react";
import { startTradeProcess } from "../../axios/queries";
import { chainsBlockScanUrl } from "../../constants/chains";
import { getNativeBalance } from "../../utils/getBalance";
import { getShortAddress } from "../../utils/getShortAddress";

export const BotItem = (props: any) => {
  const { config, userAddress } = props;
  const [nativeBalance, setNativeBalance] = useState(0);
  const [started, setStarted] = useState(false);
  async function getBalances() {
    await getNativeBalance(config.walletAddress).then((res) =>
      setNativeBalance(res)
    );
  }
  getBalances();

  async function startConfig() {
    setStarted(true);
    try {
      const start = await startTradeProcess(userAddress, config.configId);
      console.log(start);

      if (start) {
      }
      setStarted(false);
    } catch (err) {
      console.log(err);
      setStarted(false);
    }
  }
 

  return (
    <Card
      title={<h2>{"Config: " + config.configName}</h2>}
      bordered={true}
      style={{ width: 300 }}
    >
      <h2>
        Wallet:{" "}
        <a
          href={(chainsBlockScanUrl[97] +"address/" + config.walletAddress).toLocaleLowerCase()}
          target="Blanck"
        >
          {getShortAddress(config.walletAddress)}
        </a>
      </h2>

      <p>{"Balance: " + nativeBalance.toFixed(4) + " BNB"}</p>
      <h4>{"Swap amount: " + config.swapAmount} </h4>
      <h4>{"Time interval amount: " + config.timeInterval + " sec."}</h4>
      <h4>{"Token From: " + getShortAddress(config.tokenAaddress)}</h4>
      <h4>{"Token To: " + getShortAddress(config.tokenBaddress)}</h4>

      <Button
        color="green"
        onClick={startConfig}
        loading={started}
        // loadingPosition="start"
        // startIcon={<SaveIcon />}
        // variant="contained"
      >
        <span>Start Bot</span>
      </Button>
    </Card>
  );
};
