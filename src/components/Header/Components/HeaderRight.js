"use client";

import { App } from '@/app/layout';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightRoundOutlinedIcon from '@mui/icons-material/NightlightRoundOutlined';
import { useContext } from 'react';
import styled from 'styled-components';
import Wallet from './Wallet';

function HeaderRight() {

  const themeToggler = useContext(App);

  return (
    <HeaderRightWrapper>
      <Wallet/>
      <ThemeToggle onClick={themeToggler.changeTheme}>
          {themeToggler.theme === "light" ? <NightlightRoundOutlinedIcon /> : <LightModeOutlinedIcon />}
      </ThemeToggle>
    </HeaderRightWrapper>
  )
}

export default HeaderRight

const HeaderRightWrapper = styled.div`
  margin-right: 20px;
  height: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 10px;
`

const ThemeToggle = styled.div`
    background-color: ${(props) => props.theme.bgDiv};
    height: 80%;
    padding: 5px;
    width: 40px;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 3px;
    cursor: pointer;
`