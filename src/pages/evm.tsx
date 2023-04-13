import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
// import Icon from "@mui/material/Icon";
import { Contract, ethers } from "ethers";
import {
  BLURE_ADDRESS,
  CALC_VM_ADDRESS,
  MULTI_SIG_ADDRESS,
  REWARD_ADDRESS,
  ROOT_ADDRESS,
} from "../constants";
import ABI from "../abis/calcVMabi.json";
// import ABI_BLUR from "../abis/blur-abi.json";
// import ABI_SIG from "../abis/multisig.json";
// import ABI_ROOT from "../abis/root.json";
// import REWARD_ABI from "../abis/reward.json";
// import Web3 from "@walletconnect/web3-provider";
import { useContract, useSigner, useAccount } from "wagmi";
import { addTokenToDb, getAllTokensFromDb, getWalletsFromDb } from "../axios/queries";
import { NavTabs } from "../components/Tabs";
// import { waitForTransaction } from "@wagmi/core";

const Wraper = styled.div`
  cursor: default;
  font-family: Inter, sans-serif;
  max-width: 21.25rem;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  width: 100%;
  margin: auto;
  padding: 10%;
`;

const TabWraper = styled.div`
min-width: 100%;
`;

const Body = styled.div`
  background-color: #131315;
  border-radius: 0.75rem;
  padding: 1.5rem;
  position: relative;
  width: 100%;
  z-index: 2;
`;

const Monitor = styled.div`
  margin: auto;
  border-radius: 0.75rem;
  position: relative;
  padding: 10px 0;
  width: 100%;
  border: 1px solid;
  height: fit-content;
  min-height: 100px;
  display: flex;
  align-items: flex-end;

  text {
    font-size: 30px;
    padding: 5px;
    overflow-x: hidden;
  }
`;

const BoxBtn = styled.div`
  margin: auto;
  position: relative;
  padding: 10px 0;
  width: 100%;
  height: fit-content;
  min-height: 100px;
  display: flex;
  max-width: 300px;
  flex-wrap: wrap;
  h2 {
    line-height: 100%;
    margin: auto;
  }
`;

export const EvmPage = () => {
  const jsonRpcProvider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/eth_goerli"
  );
  const calcVmContract = new ethers.Contract(
    CALC_VM_ADDRESS,
    ABI,
    jsonRpcProvider
  );

  const [monitorValue, setMonitorValue] = useState<string>("");
  const [isOperation, setIsOperation] = useState<boolean>(false);
  const [isEquals, setIsEquals] = useState(false);
  const [operations, setOperations] = useState<string[]>(["0x"]);
  const [stack, setStack] = useState("");
  function clear() {
    setIsEquals(false);
    setMonitorValue("");
    setIsOperation(false);
    setStack("");
    setOperations(["0x"]);
  }
  function enterValue(value: number) {
    if (isEquals) {
      clear();
      return;
    }
    setMonitorValue(monitorValue + value);
    setStack(stack + value);
    setIsOperation(false);
  }

  function del() {
    if (isEquals) {
      clear();
      return;
    }
    setMonitorValue(monitorValue.substring(0, monitorValue.length - 1));
    setStack(stack.substring(0, stack.length - 1));
  }
  function setOperation(value: string, operation: string) {
    if (isEquals) {
      clear();
      return;
    }
    if (monitorValue.length === 0 && value !== "-") return;
    // if (
    //   (monitorValue.length === 0 && value === "-") ||
    //   (value === "-" &&
    //     Number.isNaN(Number(
    //       monitorValue.substring(
    //         monitorValue.length - 2,
    //         monitorValue.length - 1
    //       )
    //     )) &&
    //     Number(
    //       monitorValue.substring(
    //         monitorValue.length - 3,
    //         monitorValue.length - 2
    //       )
    //     ) >= 0)
    // ) {
    //   console.log("SRABOTALO");
    //   setMonitorValue(
    //     monitorValue.substring(0, monitorValue.length - 1) + value
    //   );
    //   return;
    // }

    if (isOperation && operations.length > 2) {
      setMonitorValue(
        monitorValue.substring(0, monitorValue.length - 1) + value
      );
      const res = operations;
      res.pop();
      res.push(operation);
      setStack(stack.substring(0, monitorValue.length - 1));
      setOperations(res);
      operation === "04" && setMonitorValue(monitorValue + "+1");
      operation === "05" && setMonitorValue(monitorValue + "-1");
      console.log(operations.join(""), stack);
    } else {
      const res = operations;
      res.push();
      setOperations(res);
      setIsOperation(true);
      setMonitorValue(monitorValue + value);
      setStack(stack + ",");
    }
  }

  const equals = async () => {
    console.log(
      Number(
        monitorValue.substring(monitorValue.length - 2, monitorValue.length - 1)
      )
    );

    console.log(operations.join(""), stack);
    if (isEquals) return;
    try {
      const stack_: number[] = [];
      stack.split(",").map((i) => stack_.push(Number(i)));
      console.log(stack_);

      const res = await calcVmContract.execute(operations.join(""), stack_);
      console.log(res);
      setMonitorValue(monitorValue + "=" + res[0]);
      setIsEquals(true);
    } catch {
      clear();
    }
  };
  // const jsonRpcProviderMainnet = new ethers.providers.JsonRpcProvider(
  //   " https://eth.llamarpc.com"
  // );
  const { data: signer, isError, isLoading } = useSigner();

  // const blurContract = new ethers.Contract(BLURE_ADDRESS, ABI_BLUR, signer);
  // const multiSigContract = useContract({
  //   address: MULTI_SIG_ADDRESS,
  //   abi: ABI_SIG,
  //   signerOrProvider: signer,
  // });
  //  new ethers.Contract(MULTI_SIG_ADDRESS, ABI_SIG, signer);
  //  new ethers.Contract(ROOT_ADDRESS, ABI_ROOT, signer);

  // const rootContract = useContract({
  //   address: ROOT_ADDRESS,
  //   abi: ABI_ROOT,
  //   signerOrProvider: signer,
  // });
  // const rewardContract = useContract({
  //   address: REWARD_ADDRESS,
  //   abi: REWARD_ABI,
  //   signerOrProvider: signer,
  // });

  let txReceipt;
  let id_ = 0;
  // async function addSnapshotter() {
  //   if(!rootContract || !multiSigContract) return
  // const tx = await rootContract.populateTransaction.changeRewardCalcs("0xdffeFb3c48eE32df5662C0d8F8D57b64A6dD0b34")
  // console.log(tx)
  // const tx_ = await multiSigContract.submitTransaction(ROOT_ADDRESS, 0, tx.data)
  // console.log(tx_)

  // txReceipt = await waitForTransaction({hash: tx_.hash})
  //  id_ = await multiSigContract.transactionCount() - 1;

  // alert({"ХЕШ": txReceipt.transactionHash, "id": id_})
  // }

  // async function addSnapshotter() {
  //   if(!rewardContract || !multiSigContract) return
  // const tx = await rewardContract.populateTransaction.initialize("0x52C4fb295A6296A11411c68Dc5c97602E3B12A37", "0x98D4b841786094F76ce2f5fF56B983091DCC4428",  "0x6264462cEb2efce1e6233b15B963061ca83124Ef" )
  // console.log(tx)
  // const tx_ = await multiSigContract.submitTransaction(REWARD_ADDRESS, 0, tx.data)
  // console.log(tx_)

  // txReceipt = await waitForTransaction({hash: tx_.hash})
  //  id_ = await multiSigContract.transactionCount() - 1;

  // alert({"ХЕШ": txReceipt.transactionHash, "id": id_})
  // }

  // async function changeUnionWallet() {
  //   if (!rootContract || !multiSigContract) return;
  //   const address = prompt("Union Wallet address");
  //   if (!address || address.length !== 42 || address.substring(0, 2) !== "0x") {
  //     alert("Union Wallet address is not correct :(");
  //     return;
  //   }
  //   const tx = await rootContract.populateTransaction.changeUnionWallet(
  //     address
  //   );
  //   console.log(tx);
  //   const tx_ = await multiSigContract.submitTransaction(
  //     ROOT_ADDRESS,
  //     0,
  //     tx.data
  //   );
  //   console.log(tx_);

  //   txReceipt = await waitForTransaction({ hash: tx_.hash });
  //   id_ = (await multiSigContract.transactionCount()) - 1;
  //   const _unionWallet = await rootContract._unionWallet();

  //   alert(
  //     ("ХЕШ: " + txReceipt.transactionHash,
  //     " id: " + id_,
  //     "NEW Union Wallet address: " + _unionWallet)
  //   );
  // }

  // async function confirmTrans() {
  //   if (!multiSigContract) return;
  //   id_ = await multiSigContract.transactionCount();
  //   const id__ = prompt("Curent ID is: " + (id_ - 1) + "   ID");
  //   console.log(id__);
  //   const tx = await multiSigContract.confirmTransaction(id__, {
  //     gasLimit: 750000,
  //   });
  //   alert({ ХЕШ: tx });
  //

  const ethereum = window.ethereum;
  const [curentTab, setCurentTab] = useState(0);
  const provider = new ethers.providers.JsonRpcProvider();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [userWallets, setUserWalets] = useState<any[]>([]);
  async function getUserWallets() {
    if (!address || !ethereum) return;
    const from = address;
    const message = "Hello, Bot!";
    const msg = `0x${Buffer.from(message, "utf8").toString("hex")}`;
    // const sign = await ethereum.request({
    //   method: "personal_sign",
    //   params: [msg, from, "Example password"],
    // });

    // // const signer = provider.getSigner(0);
    // // Сообщение для подписи

    // // const signature = await signer.signMessage(message);
    // console.log(sign, address);

    // if (!sign) return;
    // const userWallets = await getWalletsFromDb(sign, address);
    // setUserWalets([userWallets]);
    // console.log(userWallets);
  }
  useEffect(() => {
    address && getUserWallets();
  }, [address]);

  // async function addToken() {

  //   const token = await addTokenToDb("0x14663b19B786c8faC127B2A9a1B1594A0FD529F7", 97)
  //   console.log(token)
  // }

  async function getAllTokens() {
    const tokens = await getAllTokensFromDb()
    console.log(tokens)
  }

  // const cancelOrder = async () => {
  //   const trader = "0x2f3D3d4B5db4fC790F4bcC0e2B0fE9a8Ef42f6Ad";
  //   const side = 1;
  //   const matchingPolicy = "0x0000000000daB4A563819e8fd93dbA3b25BC3495";
  //   const collection = "0xeb113c5d09bfc3a7b27A75Da4432FB3484f90c6A";
  //   const tokenId = 1001141;
  //   const amount = 1;
  //   const paymentToken = "0x0000000000000000000000000000000000000000";
  //   const price = "100500000000000000";
  //   const listingTime = 1676803945;
  //   const expirationTime = 1692355940;
  //   const fee = [50, "0x20A61252CF47Cc71aFEa0728D139Fd490e812Fa2"];

  //   const salt = "31042698674299684881058260841661416974";
  //   console.log(blurContract);

  //   await blurContract
  //     .cancelOrder([{
  //       trader,
  //       side,
  //       matchingPolicy,
  //       collection,
  //       tokenId,
  //       amount,
  //       paymentToken,
  //       price,
  //       listingTime,
  //       expirationTime,
  //       fee,
  //       salt,
  //       extraParams: "0x01",}]
  //     )
  //     .catch((err: any) => console.log(err));
  // };


  return (
    <Wraper>
     <TabWraper>
      <NavTabs activeTabId={curentTab} titles={["Wallets", "Bots"]}/>
     </TabWraper>

      <Button onClick={getUserWallets}>getUserWallets</Button>
      <br />
      {/* <Button onClick={addToken}>Добавить токен</Button> */}
      <Button onClick={getAllTokens}>Все токены</Button>
    </Wraper>
  );
};

//  [0x13fedda7d44fbb46b4cb68d0e4716420e5f56239314e021a8573f2875317d44d, 0x03371dd72dda6e0a2e3d9305993a0f9f00f6f1c1be6e4c24b317fbe86e9a930b]
