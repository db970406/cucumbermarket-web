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
import { gql, useLazyQuery, useReactiveVar } from "@apollo/client"
import { darkModeVar } from "../../../utils/apollo"
import { useState } from 'react'
import Input from '../../shared/form/Input'
import { useForm } from 'react-hook-form'
import { ITEM_DISPLAY_FRAGMENT } from '../../shared/utils/fragments'

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
    @media screen and (max-width:650px){
        display:none;
    }
`
const Tab = styled.button`
`
const InputContainer = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하고 Input의 길이 조절을 위함
    margin-right:30px;
    display:flex;
    align-items:center;
    position:relative;
    width:230px;
    transition:all 0.3s ease-in-out;
`
const SearchBtn = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하기 위함
    position:absolute;
    right:10px;
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
    const darkMode = useReactiveVar(darkModeVar)
    const { loggedInUser } = useLoggedInUser()
    const history = useHistory()

    const getSearchMode = (bool) => setSearchMode(bool)

    const { register, handleSubmit, formState } = useForm({
        mode: "onChange"
    })

    const searchCompleted = ({ searchItems }) => {
        history.push("/", {
            searchItems
        })
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
    }

    const sendWhere = (path) => {
        history.push(path)
        window.location.reload()
    }
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
                {searchMode ? (
                    <InputContainer>
                        <Input
                            placeholder='동네 등 키워드를 입력하세요.'
                            {...register("keyword", {
                                required: true,
                                minLength: {
                                    value: 2,
                                    message: "두 글자 이상을 입력하세요."
                                }
                            })}
                            required
                        />
                        <SearchBtn onClick={formState.isValid && searchMode ? handleSubmit(onValid) : () => getSearchMode(false)}>
                            <FontAwesomeBtn
                                icon={faSearch}
                                color={darkMode ? colors.white : colors.black}
                                size={"lg"}
                                onClick={() => null}
                                disabled={!formState.isValid || loading}
                            />
                        </SearchBtn>
                    </InputContainer>
                ) : (
                    <FontAwesomeBtn
                        icon={faSearch}
                        size={"lg"}
                        color={colors.green}
                        onClick={() => getSearchMode(true)}
                        marginRight={20}
                    />
                )}
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