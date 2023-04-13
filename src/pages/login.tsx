import styled from 'styled-components'
import Button from '@mui/material/Button';
import { useConnect} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3Modal } from "@web3modal/react";



const Wraper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 10% 0;
    margin: auto;
    h5{
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 140%;
    color: var(--polus_text_white);
    margin: 0;
    }
`

export const LoginForm = (connectBtn: any, chain: any) => {
    const { isOpen, open, close, setDefaultChain } = useWeb3Modal();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
      })
      setDefaultChain(chain);

    return(
    <>
    <Wraper>
        <h5>
        Connect your wallet to continue
        </h5>
        <br />
        <Button variant="contained" onClick={() => open()} className="w3m-core-button">
        Connect Wallet
       </Button>
       </Wraper>
    </>
    )
}