import "./App.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import {
  configureChains,
  createClient,
  useAccount,
  WagmiConfig,
} from "wagmi";
import { bsc } from '@wagmi/core/chains'

// import { arbitrum, mainnet, polygon } from "wagmi/chains";
import { WC_PROJECT_ID } from "./constants";
import { LoginForm } from "./pages/login";
import { Header } from "./components/header";
import styled from "styled-components";
import { EvmPage } from "./pages/evm";
import { Dashboard } from "./pages/Dashboard";

const BodyWraper = styled.div`
  width: 100%;
  height: 100%;
`;
const chains = [bsc];
const projectId = WC_PROJECT_ID;
console.log(projectId);

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  const { address, isConnected } = useAccount();
  return (
    <BodyWraper>
      <WagmiConfig client={wagmiClient}>
        <Header />
        {!isConnected ? <LoginForm connectBtn={null} chain={bsc} /> : 
        <>
        <Dashboard/>  
        </>}
      </WagmiConfig>
      <Web3Modal
        themeMode={"dark"}
        themeVariables={{
          "--w3m-font-family": "Roboto, sans-serif",
          "--w3m-accent-color": "#1850AC",
          "--w3m-logo-image-url":
            "data:image/png;base64,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",
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </BodyWraper>
  );
}

export default App;

