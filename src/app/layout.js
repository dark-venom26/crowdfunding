"use client";

import Header from "@/components/Header/Header";
import themes from "@/constants/theme";
import { createContext, useState } from "react";
import { ToastContainer } from "react-toastify";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import '../styles/global.css';
import 'react-toastify/dist/ReactToastify.css';


const App = createContext();

export default function RootLayout({ children }) {

  const [theme, setTheme] = useState('light');

  const changeTheme = () => {
    setTheme(theme === "light"? "dark" : "light")
  }


  return (
    <html lang="en">
      <head />
      <body>
          <App.Provider value={{changeTheme, theme}}>
            <ThemeProvider theme={themes[theme]}>
              <ToastContainer/>
              <LayoutWrapper>
                <GlobalStyle/>
                <Header/>
                {children}
              </LayoutWrapper>
            </ThemeProvider>
          </App.Provider>
      </body>
    </html>
  )
}


const GlobalStyle = createGlobalStyle`
  body{
    margin: 0;
    padding: 0;
    font-family: 'Crimson Text', serif;
  }
`

const LayoutWrapper = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.bgColor};
  background-image: ${(props) => props.theme.bgImage};
  color: ${(props)=> props.theme.color};
`

export {App};