/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.16
*/

/*
1. MainLayout을 사용하는 모든 Screen이 가지는 Header Component이다.
2. 뒤로 가기 구현(Home제외)
3. 오이 클릭하여 Home으로 가기 구현
4. searchItems 버튼 및 기능 구현
5. uploadItem 버튼 추가
6. 현재 로그인한 유저(useLoggedInUser hook)의 avatar를 띄워준다. 
*/

import { faBackspace, faEraser, faSearch, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import { colors } from '../../../utils/styles'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import UserAvatar from './UserAvatar'
import { useReactiveVar } from "@apollo/client"
import { darkModeVar, searchDataVar, searchModeVar } from "../../../utils/apollo"
import SearchItems from '../items/SearchItems'

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
    gap:20px;
    @media screen and (max-width:650px){
        display:none;
    }
`
const Tab = styled.button`

`

export default function Header() {
    const searchMode = useReactiveVar(searchModeVar)
    const searchData = useReactiveVar(searchDataVar)
    const darkMode = useReactiveVar(darkModeVar)
    const { loggedInUser } = useLoggedInUser()
    const history = useHistory()

    // Reactive Variables를 이용하여 searchMode라면 Input창을, 아니라면 search 버튼을 띄워줄 것이다.
    const getSearchMode = (bool) => searchModeVar(bool)

    // path를 인자로 받아 원하는 path로 보내준다.
    const sendWhere = (path) => history.push(path)

    // searchItems로 data를 searchDataVar에 담아놓은 것을 초기화하는 기능
    const resetSearch = () => searchDataVar([])

    // path가 "/"인지에 따라 버튼을 다르게 설정하기 위함
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
                {pathname === "/" ? (
                    searchData.length > 0 ? (
                        <FontAwesomeBtn
                            onClick={() => resetSearch()}
                            icon={faEraser}
                            color={colors.red}
                            size={"2x"}
                        />
                    ) : (
                        searchMode ? (
                            <SearchItems />
                        ) : (
                            <FontAwesomeBtn
                                icon={faSearch}
                                size={"lg"}
                                color={colors.green}
                                onClick={() => getSearchMode(true)}
                            />
                        )
                    )
                ) : null}
                <FontAwesomeBtn
                    icon={faUpload}
                    size={"lg"}
                    color={colors.green}
                    onClick={() => sendWhere(`/item/upload`)}
                />
                <Tab onClick={() => sendWhere(`/user/${loggedInUser?.id}`)}>
                    <UserAvatar img={loggedInUser?.avatar} size={30} />
                </Tab>
            </Tabs>
        </Container>
    )
}