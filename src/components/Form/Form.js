"use client";

import { ethers } from "ethers";
import { createContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import styled from "styled-components"
import FormLeftWrapper from "./Components/FormLeftWrapper"
import FormRightWrapper from "./Components/FormRightWrapper"
import CampaignFactory from "../../../artifacts/contracts/Campaign.sol/CampaignFactory.json"
import Link from "next/link";


const FormState = createContext();

function Form() {

  const [form, setForm] = useState({
    campaignTitle: "",
    description: "",
    requiredAmount: "",
    category: "education"
  })

  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const [image, setImage] = useState(null);
  const [descriptionUrl, setDescriptionUrl] = useState();
  const [imageUrl, setImageUrl] = useState();

  const ImageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  const FormHandler = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value
    })
  }

  const startCampaign = async () => {

    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    if(form.campaignTitle === ""){
      toast.warn("Title field can't be empty");
    }else if(form.description === ""){
      toast.warn("Description field can't be empty");
    }else if(form.requiredAmount === ""){
      toast.warn("Please enter the required amount")
    }else if(uploaded === false){
      toast.warn(`Files upload required`);
    }else{
      setLoading(true);

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        signer
      );

      const campaignData = await contract.createCampaign(
        form.campaignTitle,
        ethers.utils.parseEther(form.requiredAmount),
        imageUrl,
        descriptionUrl,
        form.category
      );
      
      await campaignData.wait();

      setAddress(campaignData.to)
    }
  }

  
  return (
    <FormState.Provider value={{form, image, setImage, ImageHandler, FormHandler, setDescriptionUrl, setImageUrl, setAddress, setLoading, startCampaign, setUploaded, uploaded}}>
      <FormWrapper>
        <FormMain>
          {
            loading ? address === "" ?
            <Spinner>
              <TailSpin height={60} />
            </Spinner>:
            <Address>
              <h1>Campaign Started Successfully</h1>
              <h2>{address}</h2>
              <Link href="/">
                <Button>
                  Go to Campaign
                </Button>
              </Link>
            </Address> :
            <FormInputsWrapper>
              <FormLeftWrapper/>
              <FormRightWrapper/>
            </FormInputsWrapper>
          }      
          </FormMain>
      </FormWrapper>
    </FormState.Provider>
  )
}

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const FormMain = styled.div`
  width: 80%;
`

const FormInputsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`

const Spinner = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Address = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.bgSubDiv};
  border-radius: 3px;
  align-items: center;
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  padding: 15px;
  color: white;
  background-image: linear-gradient(180deg, rgba(156,212,0,1) 5%, rgba(62,201,0,1) 45%, rgba(111,199,69,1) 85%);
  border: none;
  cursor: pointer;
  margin-top: 25px;
  font-weight: bold;
  font-size: large;
`

export default Form;
export {FormState};