"use client"

import { AccountBoxOutlined, EventOutlined, FilterAltOutlined, PaidOutlined } from "@mui/icons-material"
import { ethers } from "ethers"
import Image from "next/image"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import styled from "styled-components"
import CampaignFactory from "../../artifacts/contracts/Campaign.sol/CampaignFactory.json";

async function getCampaignDetails() {

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_RPC_URL
  );

  const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      CampaignFactory.abi,
      provider
  );

  const getAllCampaigns = contract.filters.campaignCreated();
  const allCampaigns = await contract.queryFilter(getAllCampaigns);
  const allCampaignsData = allCampaigns.map((e)=>{
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      campaignAddress: e.args.campaignAddress,
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      timeStamp: parseInt(e.args.timestamp),
    }
  })
  
  const getHealthCampaigns = contract.filters.campaignCreated(null, null, null, null, null, null, null, 'health');
  const healthCampaign = await contract.queryFilter(getHealthCampaigns);
  const healthCampaignData = healthCampaign.map((e)=>{
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      campaignAddress: e.args.campaignAddress,
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      timeStamp: parseInt(e.args.timestamp),
    }
  })
  
  const getEducationCampaigns = contract.filters.campaignCreated(null, null, null, null, null, null, null, 'education');
  const educationCampaign = await contract.queryFilter(getEducationCampaigns);
  const educationCampaignData = educationCampaign.map((e)=>{
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      campaignAddress: e.args.campaignAddress,
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      timeStamp: parseInt(e.args.timestamp),
    }
  })

  const getAnimalCampaigns = contract.filters.campaignCreated(null, null, null, null, null, null, null, 'animal');
  const animalCampaign = await contract.queryFilter(getAnimalCampaigns);
  const animalCampaignData = animalCampaign.map((e)=>{
    return {
      title: e.args.title,
      image: e.args.imgURI,
      owner: e.args.owner,
      campaignAddress: e.args.campaignAddress,
      amount: ethers.utils.formatEther(e.args.requiredAmount),
      timeStamp: parseInt(e.args.timestamp),
    }
  })
  
  return {
    allCampaignsData,
    healthCampaignData,
    educationCampaignData,
    animalCampaignData
  }
}

const data = getCampaignDetails();

export default function Home() {

  const {
    allCampaignsData,
    healthCampaignData,
    educationCampaignData,
    animalCampaignData
  } = use(data);

  const [filter, setFilter] = useState([])

  useEffect(() => {
    setFilter(allCampaignsData)
  }, [allCampaignsData])
  
  
  return (
    <HomeWrapper>
      <FilterWrapper>
        <FilterAltOutlined style={{fontSize:40}}/>
        <Category onClick={()=> setFilter(allCampaignsData)}>All</Category> 
        <Category onClick={()=> setFilter(healthCampaignData)}>Health</Category> 
        <Category onClick={()=> setFilter(educationCampaignData)}>Education</Category> 
        <Category onClick={()=> setFilter(animalCampaignData)}>Animal</Category> 
      </FilterWrapper>

      <CardsWrapper>
        {
          filter?.map((data)=>{
            return (
              <Card key={data.campaignAddress}>
                <CardImg>
                  <Image src={`https://gateway.pinata.cloud/ipfs/${data.image}`} loading="eager" priority={true} alt="Campaign Image" width={300} height={120} style={{borderRadius: '3px'}} />
                </CardImg>
                <Title>
                  {data.title}
                </Title>
                <CardData>
                  <Text>Owner <AccountBoxOutlined/></Text>
                  <Text>{data.owner.slice(0,6)}...{data.owner.slice(39)}</Text>
                </CardData>
                <CardData>
                  <Text>Amount <PaidOutlined/></Text>
                  <Text>{data.amount} GoerliEth</Text>
                </CardData>
                <CardData>
                  <Text><EventOutlined/></Text>
                  <Text>{new Date(data.timeStamp * 1000).toLocaleString()}</Text>
                </CardData>
                <Link href={'/' + data.campaignAddress}>
                  <Button >
                    Go to Campaign
                  </Button>
                </Link>
              </Card>
            )
          })
        }
        
      </CardsWrapper>
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 15px;
`

const Category = styled.div`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  margin: 0px 5px;
  border-radius: 3px;
  cursor: pointer;
`

const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin-top: 25px;
`

const Card = styled.div`
  width: 300;
  margin-top: 20px;
  background-color: ${(props)=> props.theme.bgDiv};
  border-radius: 3px;

  &:hover{
    transform: translateY(-10px);
    transition: transform 0.5s;
  }

  &:not(:hover){
    transition: transform 0.5s;
  }
`

const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`

const Title = styled.h2`
  font-size: 18px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 12px 5px 5px 5px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  margin: 0;
`

const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${(props)=> props.theme.bgSubDiv};
  padding: 10px;
  cursor: pointer;
`

const Text = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  margin: 0;
`

const Button = styled.button`
  padding: 10px;
  text-align: center;
  width: 100%;
  background-image: linear-gradient(180deg, rgba(156,212,0,1) 5%, rgba(62,201,0,1) 45%, rgba(111,199,69,1) 85%);
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border-radius: 3px;
`
