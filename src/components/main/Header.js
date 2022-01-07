/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

import { useReactiveVar } from '@apollo/client'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import { darkModeVar } from '../../utils/apollo'
import { colors } from '../../utils/styles'
import UserAvatar from './UserAvatar'

const Container = styled.header`
    padding:20px 30px;
    display:flex;
    justify-content:space-around;
    align-items:center;
    position:sticky;
    top:0;
    border-bottom:0.5px solid ${colors.lightgray};
    background-color:${props => props.theme.header};
    z-index:1;
`
const Logo = styled.img`
    width:40px;
    height:40px;
`

const Tabs = styled.div`
    display:flex;
`
const Tab = styled.button`
    margin-left:10px;
`

export default function Header() {
    const { data: userData } = useLoggedInUser()
    const darkMode = useReactiveVar(darkModeVar)

    return (
        <Container>
            <Link to="/">
                <Logo src={require("../../images/cucumber.png")} />
            </Link>
            <Tabs>
                <Tab>
                    <FontAwesomeIcon color={colors.green} icon={faSearch} size="lg" />
                </Tab>
                <Tab>
                    <UserAvatar img={userData?.seeLoggedInUser?.avatar} size={30} />
                </Tab>
            </Tabs>
        </Container>
    )
}