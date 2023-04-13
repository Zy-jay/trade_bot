import { useEffect, useState } from "react";
import {
  ArrowDownOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SmileOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  FloatButton,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Space,
} from "antd";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { TextField } from "@mui/material";
import {
  addTokenToDb,
  addTradeConfigToDb,
  createNewWallet,
  getAllTokensFromDb,
  getUserConfigsFromDb,
  getUserWalletsFromDb,
} from "../../axios/queries";
import { Token } from "../../types/Token";
import { getShortAddress } from "../../utils/getShortAddress";
import { Wallet } from "../../types/Wallet";
import { getTokenInfo } from "../../utils/getErc20TokenInfo";
import { checkAddress } from "../../utils/checkAddress";
import { config } from "dotenv";
import useNotification from "antd/es/notification/useNotification";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { BotItem } from "./item";

const Wraper = styled.div`
  cursor: default;
  font-family: Inter, sans-serif;
  width: 100%;
  margin: auto;
  padding: 10px;
  display: flex;
  img{
   display: flex;
  margin: auto 5px auto auto;
  }
  option{
    display: flex;
    alig-items: center:

  }
`;
const TabWraper = styled.div`
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const TabContent = styled.div`
  min-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function Bot(props: any) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (
    message_: string | React.ReactNode,
    description_: string | React.ReactNode,
    err?: boolean
  ) => {
    api.open({
      message: message_,
      description: description_,
      placement: "topLeft",
      icon: err ? (
        <InfoCircleOutlined style={{ color: "red" }} />
      ) : (
        <CheckCircleOutlined style={{ color: "green" }} />
      ),
    });
  };

  const chainId = 97;
  const { active } = props;
  const { address, isConnected } = useAccount();
  const [awaitConfig, setAwaitConfig] = useState(false);
  const [addetToke, setAddetToke] = useState(false);
  const [open, setOpen] = useState(false);
  const [openToken, setOpenToken] = useState(false);
  const [name, setName] = useState("");
  const [newTokenUrl, setNewTokenUrl] = useState("");

  const [amountToSwap, setAountToSwap] = useState(0);
  const [interval, setInterval] = useState(0);
  const [tokens, setTokens] = useState<Token[]>();
  const [configs, setCongigs] = useState<any[]>();
  const [newToken, setNewToken] = useState<Token>();
  const [selectedWallet, setSelectedWallet] = useState<Wallet>();
  const [newTokenAddress, setNewTokenAddress] = useState<string>();
  const [userWalets, setUserWalets] = useState<Wallet[]>();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const showDrawerToken = () => {
    setOpenToken(true);
  };
  const onCloseToken = () => {
    setOpenToken(false);
  };
  const [tokenA, setTokenA] = useState<Token>();
  const [tokenB, setTokenB] = useState<Token>();

  const setToken = (aOrb: number, value: string) => {
    if (tokens?.length)
      if (aOrb === 0) {
        setTokenA(
          tokens.filter(
            (token) =>
              token.address.toLocaleLowerCase() === value.toLocaleLowerCase()
          )[0]
        );
      } else {
        setTokenB(
          tokens.filter(
            (token) =>
              token.address.toLocaleLowerCase() === value.toLocaleLowerCase()
          )[0]
        );
      }
  };
  async function getTokens() {
    const tokens_ = await getAllTokensFromDb();
    if (tokens_) {
      setTokens(tokens_);
      console.log(tokens_);
    }
  }
  //   const { decimals, symbol } = useTokenInfo(newTokenAddress, chainId);

  async function addNewTokenInfo() {
    if (!checkAddress(newTokenAddress) || !newTokenAddress) {
      openNotification("Invalid Address :(", "Check Token Address", true);
      return;
    }
    setAddetToke(true);
    try {
      const { decimals, symbol } = await getTokenInfo(newTokenAddress, chainId);
      if (decimals && symbol) {
        const newToken_: Token = {
          address: newTokenAddress,
          decimals: decimals,
          name: symbol,
          url: newTokenUrl,
          chainId: chainId,
        };
        console.log(newToken_);
        setNewToken(newToken_);

        const token = await addTokenToDb(newTokenAddress, chainId, newTokenUrl);
        if (token) {
          openNotification(
            "New Token added :)",
            <>
              <p>{"Token Address: " + getShortAddress(newToken_.address)}</p>
              <p>{"Symbol: " + newToken?.name}</p>
            </>,
            false
          );
          setAddetToke(false);
          setNewTokenAddress("")
          setNewTokenUrl("")
        } else {
          openNotification("Err :(", "Check Token Address...", true);
          setAddetToke(false);
        }
      }
    } catch (err) {
      setAddetToke(false);
      openNotification("Err :(", "Check Token Address...", true);
    }
  }
  useEffect(() => {}, []);
  async function getWallets() {
    const wallets = await getUserWalletsFromDb(address);
    if (wallets) {
      setUserWalets(wallets);
      console.log(wallets);
    }
  }

  async function createConfig() {
    if (
      !address ||
      !tokenA ||
      !tokenB ||
      amountToSwap <= 0 ||
      interval <= 30 ||
      !selectedWallet
    )
      return;
    setAwaitConfig(true);
    try {
      console.log(
        address,
        tokenA?.address,
        tokenB?.address,
        amountToSwap,
        interval,
        name
      );
      const config: any = await addTradeConfigToDb(
        address,
        tokenA?.address,
        tokenB?.address,
        amountToSwap,
        interval,
        name,
        selectedWallet.walletAddress
      );
      if (config) {
        openNotification("Config Saved :)", "Config " + config.configName);
        console.log(config);
      }
      setAwaitConfig(false);
    } catch (err) {
      console.log(err);
      setAwaitConfig(false);
    }
  }
  async function getConfigs() {
    if(!address){
        return
    }
    const configs_ = await getUserConfigsFromDb(address);
    if (configs_) {
      setCongigs(configs_);
      console.log(configs_);
    }
  }

  useEffect(() => {
    if (active === 1) {
      getTokens();
      getWallets();
      getConfigs()
    }
  }, [active]);

  return (
    <Wraper>
      {contextHolder}
      {configs?.map(config_ =>{return(
        <BotItem config={config_} userAddress={address} />
      )})}
      <Drawer
        title="Create new Config"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button loading={awaitConfig} onClick={createConfig} type="primary">
              Create Config
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Config Name"
                rules={[
                  { required: true, message: "Please enter config name" },
                ]}
              >
                <TextField
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                  }}
                  value={name}
                  id="outlined-basic"
                  label="Config Name"
                  variant="outlined"
                />
              </Form.Item>
              <Select
                dropdownMatchSelectWidth={false}
                style={{ width: "100%" }}
                // placeholder="Tags Mode"
                onChange={(value: string) =>
                  setSelectedWallet(
                    userWalets?.filter(
                      (wallet) => wallet.walletAddress === value
                    )[0]
                  )
                }
                maxTagCount={2}
                // menuItemSelectedIcon={tokenA?.url && <img src={tokenA.url} width={50} />}
              >
                {userWalets?.map((item: any) => {
                  return (
                    <option value={item.walletAddress}>
                      {item.walletName}
                      <p>{getShortAddress(item.walletAddress)}</p>
                    </option>
                  );
                })}
              </Select>
              <p>from</p>
              <Select
                dropdownMatchSelectWidth={false}
                style={{ width: "100%" }}
                // placeholder="Tags Mode"
                onChange={(value) => setToken(0, value)}
                maxTagCount={2}
                // menuItemSelectedIcon={tokenA?.url && <img src={tokenA.url} width={50} />}
              >
                {tokens?.map((item: Token) => {
                  return (
                    <option value={item.address}>
                      {" "}
                      {item.url && <img src={item.url} width={20} />}
                      {item.name}
                    </option>
                  );
                })}
              </Select>
              <p>
                {" "}
                To <ArrowDownOutlined />
              </p>
              <Select
                dropdownMatchSelectWidth={false}
                style={{ width: "100%" }}
                // placeholder="Tags Mode"
                onChange={(value) => setToken(1, value)}
                maxTagCount={2}
                // menuItemSelectedIcon={tokenB?.url && <img src={tokenB.url}  width={50} />}
              >
                {tokens?.map((item: Token) => {
                  return (
                    <option value={item.address}>
                      {" "}
                      {item.url && <img src={item.url} width={20} />}{" "}
                      {item.name}
                    </option>
                  );
                })}
              </Select>
              <p>Amount to Swap</p>
              <InputNumber
                style={{ width: "150px" }}
                size="large"
                min={0.00000001}
                defaultValue={0}
                onChange={(value) => setAountToSwap(value ? value : 0)}
              />
              <br />
              <p>Time interval (sec.)</p>
              <InputNumber
                size="large"
                step={10}
                min={30}
                defaultValue={60}
                onChange={(value) => setInterval(value ? value : 0)}
              />
            </Col>
          </Row>
        </Form>
      </Drawer>
      <Drawer
        title="Add new token"
        width={420}
        onClose={onCloseToken}
        open={openToken}
        bodyStyle={{ paddingBottom: 80 }}
        extra={
          <Space>
            <Button onClick={onCloseToken}>Cancel</Button>
            <Button
              loading={addetToke}
              onClick={addNewTokenInfo}
              type="primary"
            >
              Add token
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                style={{ width: "370px" }}
                name="name"
                label="Token Address"
                rules={[
                  { required: true, message: "Please enter valid address" },
                ]}
              >
                <TextField
                  style={{ width: "100%" }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewTokenAddress(event.target.value);
                  }}
                  value={newTokenAddress}
                  id="outlined-basic"
                  label="0x..."
                  variant="outlined"
                />
              </Form.Item>
              <br />
              <Form.Item
                style={{ width: "370px" }}
                name="name2"
                label="Image url"
                rules={[
                  { required: true, message: "Please enter valid address" },
                ]}
              >
                <TextField
                  style={{ width: "100%" }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setNewTokenUrl(event.target.value);
                  }}
                  value={newTokenUrl}
                  id="outlined-basic2"
                  label="https://...."
                  variant="outlined"
                />
              </Form.Item>
              {newToken && (
                <>
                  {" "}
                  <h4>{"Symbol: " + newToken.name}</h4>
                  <h4>{"Decimals " + newToken.decimals}</h4>
                  <p>
                    {newToken.url && (
                      <img
                        src={newToken.url}
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                  </p>
                </>
              )}
            </Col>
          </Row>
        </Form>
      </Drawer>
      <FloatButton.Group
        trigger="click"
        type="primary"
        style={{ right: 24 }}
        icon={<PlusOutlined />}
      >
        <FloatButton
          onClick={showDrawerToken}
          tooltip={<div>Add Token</div>}
          icon={<PlusOutlined />}
        />
        <FloatButton
          onClick={showDrawer}
          tooltip={<div>New Config</div>}
          icon={<PlusOutlined />}
        />
      </FloatButton.Group>
      ;
    </Wraper>
  );
}
