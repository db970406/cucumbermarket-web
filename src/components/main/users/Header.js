/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.14
*/

/*
1. MainLayout을 사용하는 모든 Screen이 가지는 Header Component이다.
2. 뒤로 가기 구현
3. 오이 클릭하여 Home으로 가기 구현
4. searchItem 버튼 및 기능 구현
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
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client"
import { darkModeVar, searchDataVar } from "../../../utils/apollo"
import { useEffect, useState } from 'react'
import Input from '../../shared/form/Input'
import { useForm } from 'react-hook-form'
import { ITEM_DISPLAY_FRAGMENT } from '../../shared/utils/fragments'
import InputWithFontAwesome from '../../shared/form/InputWithFontAwesome'

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

const SEARCH_ITEMS = gql`
    query searchItems($keyword:String!){
        searchItems(keyword:$keyword){
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`

export default function Header() {
    const [searchMode, setSearchMode] = useState(false)
    const searchData = useReactiveVar(searchDataVar)
    const darkMode = useReactiveVar(darkModeVar)
    const { loggedInUser } = useLoggedInUser()
    const history = useHistory()

    // state를 이용하여 searchMode라면 Input창을, 아니라면 search 버튼을 띄워줄 것이다.
    const getSearchMode = (bool) => setSearchMode(bool)


    // searchItems 구현부
    // searchItems로 받은 data를 Home으로 보내주어 사용할 것이다.
    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange"
    })

    // searchItems 성공 시 searchDataVar를 Reactive Variables로 data를 받아놓는다.
    const searchCompleted = ({ searchItems }) => {
        searchDataVar(searchItems)
        history.push("/")
    }
    const [searchItems, { loading }] = useLazyQuery(SEARCH_ITEMS, {
        onCompleted: searchCompleted
    })
    const onValid = ({ keyword }) => {
        if (loading) return;

        searchItems({
            variables: {
                keyword
            }
        })
        setValue("keyword", "")
    }

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
                        size={"lg"}
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
                            <InputWithFontAwesome
                                onClick={formState.isValid && searchMode ? handleSubmit(onValid) : () => getSearchMode(false)}
                                icon={faSearch}
                                color={darkMode ? colors.white : colors.black}
                                size={"lg"}
                                disabled={!formState.isValid || loading}
                            >
                                <Input
                                    placeholder='동네 등 키워드'
                                    {...register("keyword", {
                                        required: true,
                                        minLength: {
                                            value: 2,
                                            message: "두 글자 이상을 입력하세요."
                                        }
                                    })}
                                    required
                                />
                            </InputWithFontAwesome>
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