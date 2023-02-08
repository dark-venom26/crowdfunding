import Link from "next/link";
import { usePathname } from "next/navigation"
import styled from "styled-components"

function HeaderNav() {
    const pathname = usePathname();

    return (
    <HeaderNavWrapper>
        <Link href='/'>
            <HeaderNavLinks href='/' active={pathname === "/" ? true : false}>
                Campaigns
            </HeaderNavLinks>
        </Link>
        <Link href='/createcampaign'>
            <HeaderNavLinks active={pathname === "/createcampaign" ? true : false}>
                Create Campaign
            </HeaderNavLinks>
        </Link>
        <Link href='/dashboard'>
            <HeaderNavLinks active={pathname === "/dashboard" ? true : false}>
                Dashboard
            </HeaderNavLinks>
        </Link>
    </HeaderNavWrapper>
  )
}

export default HeaderNav

const HeaderNavWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: ${(props)=>props.theme.bgDiv};
    padding: 6px;
    height: 50%;
    border-radius: 3px;
`

const HeaderNavLinks = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 7px;
    background-color: ${(props)=> props.active ? props.theme.bgSubDiv : props.theme.bgDiv};
    height: 100%;
    font-weight: 600;
    border-radius: 3px;
    padding: 0 6px;
    cursor: pointer;
    text-transform: uppercase;
    font-family: 'Spectral SC', serif;
    font-size: 15px;
    color: ${(props) => props.theme.color};
`