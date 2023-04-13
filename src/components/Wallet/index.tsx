import { useEffect, useState } from "react";
import { PlusOutlined, WalletOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  FloatButton,
  Form,
  Input,
  List,
  Row,
  Select,
  Space,
} from "antd";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { TextField } from "@mui/material";
import {
  createNewWallet,
  getUserWalletsFromDb,
} from "../../axios/queries";
import { WalletItem } from "./item";

const Wraper = styled.div`
  width: 100%;
  margin: auto;
  padding: 10px;
  display: flex;
  height: 100%;
  align-content: center;
  justify-content: center;
`;
const WalletsWraper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin: auto;

`;
const TabContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const Wallet = (props: any) => {
  const { active } = props;
  const { address, isConnected } = useAccount();
  const [open, setOpen] = useState(false);
  const [userWallets, setUserWallets] = useState<any[]>([]);
  const [name, setName] = useState("");
 const [awaitNewWalet, setAwaitNewWallet] = useState(false)
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  async function getWallets() {
    const userWallets_ = await getUserWalletsFromDb(address);
    console.log(userWallets);
    if (userWallets_.length > 0) {
      setUserWallets(userWallets_);
    }
  }
  async function newWallet() {
    setAwaitNewWallet(true)
    if (!address) {
      return;
    }
    const wallet = await createNewWallet(address, name);
    if (wallet) {
     
     await getWallets();
      onClose();
     setName("");

    }
    setAwaitNewWallet(false)
  }
  useEffect(() => {
    if (active === 0) {
      getWallets();
    }
  }, [active]);
  return (
    <Wraper>
          <WalletsWraper>
          {userWallets.map((item) => {
            return (
                
             <WalletItem item={item}/>
             
            );
          })}
         </WalletsWraper>
        <Drawer
          title="Create a new Wallet"
          width={720}
          onClose={onClose}
          open={open}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={newWallet} type="primary" loading={awaitNewWalet}>
                Create Wallet
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Wallet Name"
                  rules={[
                    { required: true, message: "Please enter wallet name" },
                  ]}
                >
                  <TextField
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setName(event.target.value);
                    }}
                    value={name}
                    id="outlined-basic"
                    label="Wallet Name"
                    variant="outlined"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <FloatButton onClick={showDrawer} tooltip={<div>New Wallet</div>} 
         icon={<WalletOutlined />} />;
    </Wraper>
  );
};
