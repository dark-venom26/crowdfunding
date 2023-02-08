"use client"

import styled from "styled-components"
import { useContext } from "react"
import { FormState } from "../Form"

function FormLeftWrapper() {

    const Handler = useContext(FormState);

  return (
    <FormLeft>
        <FormInput>
            <label>Campaign Title</label>
            <Input onChange={Handler.FormHandler} value={Handler.form.campaignTitle} name="campaignTitle" placeholder="Campaign title..." required></Input>
        </FormInput>
        <FormInput>
            <label>Description</label>
            <TextArea onChange={Handler.FormHandler} value={Handler.form.description} name="description"  rows={10} placeholder="Describe about your campaign..." required></TextArea>
        </FormInput>
    </FormLeft>
  )
}

const FormLeft = styled.div`
    width: 48%;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
`

const FormInput = styled.div`
    display: flex;
    flex-direction: column;
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
`

const TextArea = styled.textarea`
    padding: 15px;
    background-color: ${(props) => props.theme.bgDiv};
    margin-top: 4px;
    border: none;
    border-radius: 3px;
    outline: none;
    font-size: large;
    color: ${(props)=> props.theme.color};
    max-width: 100%;
    min-width: 100%;
    font-family: 'Crimson Text', serif;
    resize: none;
`

export default FormLeftWrapper