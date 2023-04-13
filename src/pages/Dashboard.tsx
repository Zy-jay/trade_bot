import { SetStateAction, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  FloatButton,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import styled from "styled-components";
import { useAccount } from "wagmi";
import { createNewWallet } from "../axios/queries";
import { TextField } from "@mui/material";
import { NavTabs } from "../components/Tabs";
import { useActiveTabIndex } from "../hooks/useActiveTabIndex";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";
import { Wallet } from "../components/Wallet";
import { Bot } from "../components/Bot";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


const Wraper = styled.div`
  cursor: default;
  font-family: Inter, sans-serif;
  width: 100%;
  margin: auto;
  padding: 10px;
  display: flex;
  display: flex;
  justify-content: center;
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

export function Dashboard() {
  const {setActive, active } = useActiveTabIndex();


  useEffect(() => {
    
  }, [active]);

  return (
       <Tabs  selectedIndex={active}>
      <TabList style={{display: "flex", justifyContent: "center"}}>
      <NavTabs  activeTabId={active} setActive={setActive} titles={["Wallets", "Bots"]} />
      </TabList>
      <TabPanel><Wallet active={active}/></TabPanel >
      <TabPanel><Bot active={active}/></TabPanel>
      
    </Tabs>


  );
}
