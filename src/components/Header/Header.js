import styled from "styled-components"
import HeaderLogo from "./Components/HeaderLogo"
import HeaderNav from "./Components/HeaderNav"
import HeaderRight from "./Components/HeaderRight"

function Header() {
  return (
    <HeaderWrapper>
      <HeaderLogo />
      <HeaderNav />
      <HeaderRight />
    </HeaderWrapper>
  )
}

export default Header

const HeaderWrapper = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`