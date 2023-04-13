import { createRef, useState } from "react";
import styled from "styled-components";
import { useActiveTabIndex } from "../../hooks/useActiveTabIndex";
import { Dashboard } from "../../pages/Dashboard";
import { Wallet } from "../Wallet";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const Wraper = styled.div`
width: max-content;
height: max-content;
padding: 5px 10px 5px 10px;
border: 1px solid #D9D9D9;
border-radius: 20px;
display: flex;
gap: 10px;
}
`;

const TabBtn = styled.button<{ active: boolean }>`
font-family: 'Inter';
font-style: normal;
font-weight: 500;
font-size: 20px;
line-height: 24px;
cursor: pointer;
color: ${({active}) => (active ? "#FFFFFF" : "#000000")};
background: ${({active}) => (active ? "#000000" : "#F5F5F5")};
padding: 15px 28px 15px 28px;
border: none;
border-radius: 12px;
}
`;

export function NavTabs(props: any) {

  const {activeTabId, setActive, titles} = props

  return (
    <Wraper>
    
      {titles.map((title: string, index: number) => (
       <TabBtn
          onClick={() => setActive(index)}
          active={ activeTabId === index}
        > 
            {title}
        </TabBtn>
      ))}
    </Wraper>
  );
}
