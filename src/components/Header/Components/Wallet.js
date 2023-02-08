import { ethers } from "ethers"
import { useState } from "react";
import styled from "styled-components"

const networks = {
    goerli: {
        chainId: `0x${Number(5).toString(16)}`, // Goerli
    }
}

function Wallet() {

    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    
    if(typeof window !== 'undefined'){
        const {ethereum} = window;

    }

    
    const connectWallet = async() => {
        await ethereum.request({
            method: "eth_requestAccounts",
        })
        const provider = new ethers.providers.Web3Provider(ethereum, "any");

        if(provider.network !== "GoerliETH"){
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: `0x5`
                    }
                ]
            })
        }
        
        const account = provider.getSigner();
        const accountAddress = await account.getAddress();
        setAddress(accountAddress);
        
        const accountBalance = await account.getBalance();
        setBalance(ethers.utils.formatEther(accountBalance));
    }
    

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
        {balance !== '' && <Balance>{balance.slice(0,4)} GoerliETH</Balance>}
        {address === '' ? <Address>Connect Wallet</Address> : <Address>{address.slice(0,6)}...{address.slice(37)}</Address>}
    </ConnectWalletWrapper>
  )
}

const ConnectWalletWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${(props)=> props.theme.bgDiv};
    height: 80%;
    padding: 5px;
    cursor: pointer;
    color: ${(props) => props.theme.color};
    border-radius: 3px;
    font-weight: bold;
    column-gap: 10px;
`

const Address = styled.h3`
    background-color: ${(props)=> props.theme.bgSubDiv};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 3px;
    height: 100%;
    border-radius: 3px;
`

const Balance = styled.h3`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`

export default Wallet