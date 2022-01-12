/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.12
*/

import { faBackspace, faSearch, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import { colors } from '../../../utils/styles'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import UserAvatar from './UserAvatar'
import { useReactiveVar } from "@apollo/client"
import { darkModeVar } from "../../../utils/apollo"

const Container = styled.header`
    padding:20px 70px;
    display:flex;
    justify-content:space-around;
    align-items:center;
    position:sticky;
    top:0;
    background-color:${props => props.theme.header};
    z-index:1;
`
const GoBack = styled.div`
    position:absolute;
    top:30px;
    left:30px;
`

const Logo = styled.img`
    width:40px;
    height:40px;
`

const Tabs = styled.div`
    display:flex;
    align-items:center;
`
const Tab = styled.button`
`

export default function Header() {
    const darkMode = useReactiveVar(darkModeVar)
    const { loggedInUser } = useLoggedInUser()
    const history = useHistory()

    const sendWhere = (path) => history.push(path)
    const { pathname } = window.location
    return (
        <Container>
            {pathname === "/" ? null : (
                <GoBack>
                    <FontAwesomeBtn
                        icon={faBackspace}
                        size={"2x"}
                        color={darkMode ? colors.white : colors.black}
                        onClick={() => history.goBack()}
                    />
                </GoBack>
            )}
            <Tab onClick={() => sendWhere("/")}>
                <Logo src={require("../../../images/cucumber.png")} />
            </Tab>
            <Tabs>
                <FontAwesomeBtn
                    icon={faSearch}
                    size={"lg"}
                    color={colors.green}
                    onClick={() => sendWhere(null)}
                    marginRight={20}
                />
                <FontAwesomeBtn
                    icon={faUpload}
                    size={"lg"}
                    color={colors.green}
                    onClick={() => sendWhere(`/item/upload`)}
                    marginRight={20}
                />
                <Tab onClick={() => sendWhere(`/user/${loggedInUser?.id}`)}>
                    <UserAvatar img={loggedInUser?.avatar} size={30} />
                </Tab>
            </Tabs>
        </Container>
    )
}