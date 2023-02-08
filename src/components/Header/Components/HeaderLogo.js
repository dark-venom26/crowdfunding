import Image from "next/image"
import styled from "styled-components"

function HeaderLogo() {
  return (
    <Logo>
        <Image src="/favicon.png" alt="" width={50} height={50}/>
        <LogoTitle>Crowdfunding</LogoTitle>
    </Logo>
  )
}

export default HeaderLogo

const Logo = styled.div`
    display: flex;
    align-items: center;
`

const LogoTitle = styled.h2`
    font-weight: 700;
    font-size: 25px;
    font-family: 'Vollkorn SC', serif;
`