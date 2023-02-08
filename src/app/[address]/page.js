"use client";
import { ethers } from "ethers";
import Image from "next/image";
import { use, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Campaign from '../../../artifacts/contracts/Campaign.sol/Campaign.json'
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json'

export async function generateStaticParams(){
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
    
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
    );

    const getAllCampaigns = contract.filters.campaignCreated();
    const allCampaigns = await contract.queryFilter(getAllCampaigns);

    return allCampaigns.map((e)=>({
        address: e.args.campaignAddress.toString()
    }))

}


async function getCampaignDetails(address){

    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
        address,
        Campaign.abi,
        provider
    );

    const title = await contract.title();
    const requiredAmount = await contract.requiredAmount();
    const image = await contract.image();
    const description = await contract.description();
    const owner = await contract.owner();
    const receivedAmount = await contract.receivedAmount();

    const donations = contract.filters.donated();
    const allDonations = await contract.queryFilter(donations);

    const data = {
        address,
        title,
        requiredAmount: ethers.utils.formatEther(requiredAmount),
        image,
        receivedAmount: ethers.utils.formatEther(receivedAmount),
        description,
        owner
    }

    const donationData = allDonations.map((e)=>{
        return {
            donar: e.args.donar,
            amount: ethers.utils.formatEther(e.args.amount),
            timestamp: parseInt(e.args.timestamp)
        }
    })

    return {
        data,
        donationData
    }

}

const callCampaign = async (address) => {
    const {data, donationData} = await getCampaignDetails(address)

    return {data, donationData}
}

export default function detail({params}){
    const {data, donationData} = use(callCampaign(params.address));

    const [mydonations, setMydonations] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [change, setChange] = useState(false);
    
    useEffect(() => {
        const request = async () => {
            await window.ethereum.request({method: 'eth_requestAccounts'});
            
            const web3provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = web3provider.getSigner();
            const address = await signer.getAddress();

            const provider = new ethers.providers.  JsonRpcProvider(
                process.env.NEXT_PUBLIC_RPC_URL
            );
            
            const contract = new ethers.Contract(
                data.address,
                Campaign.abi,
                provider
            );

            fetch(`https://gateway.pinata.cloud/ipfs/${data.description}`).then(res=> setDescription(res.data))

            const myDonations = contract.filter.donated(address);
            const myAllDonations = await contract.queryFilter(myDonations);

            setMydonations(myAllDonations.map((e)=>{
                return {
                    donar: e.args.donar,
                    amount: ethers.utils.formatEther(e.args.amount),
                    timestamp: parseInt(e.args.timestamp)
                }
            }));
        }

        request()
    }, [change])

    const donateFunds = async () => {
        try {
            await window.ethereum.request({method: 'eth_requestAccounts'})

            const provider = new ethers.providers.web3provider(window.ethereum);

            const signer = provider.getSigner();

            const contract = new ethers.Contract(data.address, Campaign.abi, signer);

            const transaction = await contract.donate({value: ethers.utils.parseEther(amount)})

            await transaction.wait();

            setChange(true);
            setAmount()
        } catch (error) {
            console.log(error)
        }
    }
    


    return(
        <DetailWrapper>
            <LeftContainer>
                <ImageSection>
                    <Image
                        src={`https://gateway.pinata.cloud/ipfs/${data.image}`}
                        alt="Campaign Image"
                        width={300}
                        height={350}
                        loading="eager"
                        priority={true}
                    />
                </ImageSection>
                <Text>
                    {description}
                </Text>
            </LeftContainer>
            <RightContainer>
                <Title>{data.title}</Title>
                <DonateSection>
                    <Input value={amount} onChange={(e)=> setAmount(e.target.value)} type="number" placeholder="Enter amount to donate"/>
                    <Donate onClick={donateFunds}>Donate</Donate>
                </DonateSection>
                <FundsData>
                    <Funds>
                        <FundsText>Required Amount</FundsText>
                        <FundsText>{data.requiredAmount} GoerliEther</FundsText>
                    </Funds>
                    <Funds>
                        <FundsText>Received Amount</FundsText>
                        <FundsText>{data.receivedAmount} GoerliEther</FundsText>
                    </Funds>
                </FundsData>
                <Donated>
                    <LiveDonation>
                        <DonationTitle>Recent Donation</DonationTitle>
                        {
                            donationData?.map((e)=>{
                                <Donation>
                                    <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                                    <DonationData>{e.amount} GoerliEther</DonationData>
                                    <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
                                </Donation>
                            })
                        }
                    </LiveDonation>
                    <MyDonation>
                        <DonationTitle>My Past Donations</DonationTitle>
                        {
                            mydonations?.map((e)=>{
                                <Donation>
                                    <DonationData>{e.donar.slice(0,6)}...{e.donar.slice(39)}</DonationData>
                                    <DonationData>{e.amount} GoerliEther</DonationData>
                                    <DonationData>{new Date(e.timestamp * 1000).toLocaleString()}</DonationData>
                                </Donation>
                            })
                        }
                    </MyDonation>
                </Donated>
            </RightContainer>
        </DetailWrapper>
    )
}

const DetailWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
`

const LeftContainer = styled.div`
    width: 45%;
`

const RightContainer = styled.div`
    width: 50%;
`

const ImageSection = styled.div`
    width: 100%;
    position: relative;
    height: 350px;
`

const Text = styled.p`
    font-size: large;
    color: ${(props)=>props.theme.color};
    text-align: justify;
`

const Title = styled.h1`
    padding: 0;
    margin: 0;
    font-size: x-large;
    color: ${(props) => props.theme.color};
`

const DonateSection = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
`

const Input = styled.input`
    padding: 8px 15px;
    background-color: ${(props)=> props.theme.bgDiv};
    color: ${(props)=> props.theme.color};
    border: none;
    border-radius: 3px;
    outline: none;
    font-size: large;
    width: 40%;
    height: 40px;
`

const Donate = styled.button`
    display: flex;
    justify-content: center;
    width: 40%;
    padding: 15px;
    color: white;
    background-color: #00b712;
    background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
    border: none;
    cursor: pointer;
    font-size: large;
    font-weight: bold;
    font-size: large;
    border-radius: 3px;
`

const FundsData = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
`

const Funds = styled.div`
    width: 45%;
    background-color: ${(props)=> props.theme.bgDiv};
    padding: 8px;
    border: 8px;
    text-align: center;
    border-radius: 3px;
`

const FundsText = styled.p`
    margin: 2px;
    padding: 0;
    font-size: normal;
`

const Donated = styled.div`
    height: 280px;
    margin-top: 15px;
    background-color: ${(props) => props.theme.bgDiv};
`

const LiveDonation = styled.div`
    height: 65%;
    overflow-y: auto;
`

const MyDonation = styled.div`
    height: 35%;
    overflow-y: auto;
`

const DonationTitle = styled.div`
    font-size: medium;
    text-transform: uppercase;
    padding: 4px;
    text-align: center;
    background-color: #4cd137;
`

const Donation = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    background-color: ${(props)=> props.theme.bgSubDiv};
    padding: 4px 8px;
`

const DonationData = styled.p`
    color: ${(props)=> props.theme.color};
    font-size: large;
`
