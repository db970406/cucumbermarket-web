/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.14
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

    const getSearchMode = (bool) => setSearchMode(bool)

    const { register, handleSubmit, formState, setValue } = useForm({
        mode: "onChange"
    })

    const searchCompleted = ({ searchItems }) => {
        history.push("/", {
            searchItems
        })
    }
    const [searchItems, { data, loading }] = useLazyQuery(SEARCH_ITEMS, {
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

    const sendWhere = (path) => history.push(path)

    const resetSearch = () => searchDataVar([])

    const { pathname } = window.location

    useEffect(() => {
        if (data?.searchItems) {
            searchDataVar(data?.searchItems)
        }
    }, [data])
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
                            color={darkMode ? colors.white : colors.black}
                            size={"lg"}
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