"use client"

import styled from "styled-components"
import { useContext, useState } from "react"
import { FormState } from "../Form"
import { TailSpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import axios from "axios";

function FormRightWrapper() {
    const Handler = useContext(FormState);
    const [uploadLoading, setUploadLoading] = useState(false);

  const sendFileToIPFS = async (e) => {
      
    if (Handler.form.description !== "" && Handler.image !== null) {
        setUploadLoading(true);

        try {
            const jsonData = {
              "pinataMetadata": {
                  "name": "Description",
              },
              "pinataContent": {
                  "description": Handler.form.description
              }
            }
  
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: jsonData,
                headers: {
                    'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_SECRET_KEY}`,
                    "Content-Type": "application/json"
                },
            });
  
            const DescriptionHash = resFile.data.IpfsHash;
  
            Handler.setDescriptionUrl(DescriptionHash)
  
            } catch (error) {
                toast.warn(`Error Uploading Description`)
        }
          
        try {
            const formData = new FormData();
            formData.append("file", Handler.image);
  
            const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                    'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_SECRET_KEY}`,
                    "Content-Type": "multipart/form-data"
                },
            });
  
            const ImgHash = resFile.data.IpfsHash;
  
            Handler.setImageUrl(ImgHash)
  
            setUploadLoading(false);
            Handler.setUploaded(true);
            toast.success("Files Uploaded Successfully")
  
            } catch (error) {
                toast.warn(`Error Uploading Image`)
        }

    }else{
        if(Handler.form.description === ""){
            toast.warn("Description field can't be empty")
        }else{
            toast.warn("Please select a campaign image")
        }
    }

}


  return (
    <FormRight>
        <FormInput>
            <FormRow>
                <RowInput>
                    <label>Required Amount</label>
                    <Input onChange={Handler.FormHandler} value={Handler.form.requiredAmount} name="requiredAmount"  type="number" placeholder="Required Amount" required></Input>
                </RowInput>
                <RowInput>
                    <label>Choose category</label>
                    <Select onChange={Handler.FormHandler} value={Handler.form.category} name="category" required>
                        <option value="education" defaultChecked>Education</option>
                        <option value="health">Health</option>
                        <option value="animal">Animal</option>
                    </Select>
                </RowInput>
            </FormRow>
        </FormInput>

        <FormInput>
            <label>Select image</label>
            <Image onChange={Handler.ImageHandler} type="file" accept="image/*" required></Image>
        </FormInput>
        
        <Buttons>
            {
                
                <Button onClick={sendFileToIPFS} disabled={uploadLoading || Handler.uploaded}>
                    {
                    uploadLoading === true ? <TailSpin color="rgb(3,13,0)" height={20} /> : Handler.uploaded === false ? "Upload Files to IPFS" : "Files Uploaded successfully!"
                    }
                </Button>
            }
            <Button onClick={Handler.startCampaign}>
                Start Campaign
            </Button>
        </Buttons>
    </FormRight>
  )
}

const FormRight = styled.div`
    width: 48%;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
`

const FormInput = styled.div`
    display: flex;
    flex-direction: column;
`

const FormRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const RowInput = styled.div`
    display: flex;
    flex-direction: column;
    width: 45%;
`

const Input = styled.input`
    padding: 15px;
    background-color: ${(props) => props.theme.bgDiv};
    margin-top: 4px;
    border: none;
    border-radius: 3px;
    outline: none;
    font-size: large;
    color: ${(props)=> props.theme.color};
    width: 100%;
    font-family: 'Crimson Text', serif;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

`

const Select = styled.select`
    padding: 15px;
    background-color: ${(props) => props.theme.bgDiv};
    margin-top: 4px;
    border: none;
    border-radius: 3px;
    outline: none;
    font-size: large;
    color: ${(props)=> props.theme.color};
    width: 100%;
    font-family: 'Crimson Text', serif;
    cursor: pointer;
`

const Image = styled.input`
    background-color: ${(props) => props.theme.bgDiv};
    margin-top: 4px;
    border: none;
    border-radius: 3px;
    outline: none;
    font-size: large;
    color: ${(props)=> props.theme.color};
    width: 100%;

    &::-webkit-file-upload-button{
        padding: 15px;
        background-color: ${(props)=> props.theme.bgSubDiv};
        border: none;
        outline: none;
        color: ${(props)=> props.theme.color};
        font-weight: bold;
        cursor: pointer;
    }
`

const Buttons = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    justify-content: center;
`

const Button = styled.button`
    width: 100%;
    padding: 15px;
    color: white;
    background-image: linear-gradient(180deg, rgba(156,212,0,1) 5%, rgba(62,201,0,1) 45%, rgba(111,199,69,1) 85%);
    border: none;
    cursor: pointer;
    font-weight: bold;
    font-size: large;
    border-radius: 3px;
    display: flex;
    justify-content: center;

    &:disabled{
        cursor: not-allowed;
    }
`

export default FormRightWrapper