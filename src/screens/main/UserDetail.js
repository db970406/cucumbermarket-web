/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : 2022.01.11
*/
// 유저의 상세정보를 보여주는 페이지

import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import DisplayItem from '../../components/main/items/DisplayItem'
import MainLayout from "../../components/layouts/MainLayout"
import UserData from '../../components/main/users/UserData'
import Button from '../../components/shared/buttons/Button'
import { ITEM_DISPLAY_FRAGMENT, USER_DEFAULT_FRAGMENT } from '../../components/shared/utils/fragments'
import { logUserOut } from '../../utils/apollo'
import { colors } from '../../utils/styles'

const Container = styled.div`
    display:flex;
    flex-direction:column;
    max-width:1000px;
    margin:0 auto;
`
const User = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:30px;
`
const Items = styled.div`
    margin-top:30px;
`
const Flex = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
    margin-top:20px;
`

const Introduce = styled.span`
    font-size:16px;
`
const Buttons = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
`

const Tabs = styled.p`
`
const Tab = styled.button`
    ${({ isFocused }) => isFocused ?
        css`
        span{
            color:${colors.green};
            font-weight:600;
        }
        div{
            margin-top:7px;
            height:3px;
            background-color:${colors.green};
        }
    `:
        css`
        span{
            color:${({ theme }) => theme.color};
            font-weight:400;
        }
        div{
            display:none;
        }
    `
    }
    span{
        font-size: 14px;
        margin-left: 2px;
    }
    &:hover{
        span{
            color:${colors.green};
        }
    }
`

const SEE_USER = gql`
    query seeUser($id: Int!){
        seeUser(id: $id){
            ...UserDefaultFragment
            location
            introduce
            isMe
            items{
                ...ItemDisplayFragment
            }
            likes{
                ...ItemDisplayFragment
            }
            itemCount
            likeCount
        }
    }
    ${USER_DEFAULT_FRAGMENT}
    ${ITEM_DISPLAY_FRAGMENT}
`

const UserDetail = () => {
    const { id } = useParams()
    const [userData, setUserData] = useState({})
    const history = useHistory()
    const [tabFocus, setTabFocus] = useState(true)
    const focusChange = (bool) => setTabFocus(bool)


    const { loading } = useQuery(SEE_USER, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: ({ seeUser }) => setUserData(seeUser)
    })

    const sendUserEdit = () => {
        return history.push(`/user/${userData?.id}/edit`, {
            avatar: userData?.avatar
        })
    }

    return (
        <MainLayout title={`${userData?.name}님의 프로필`} loading={loading}>
            <Container>
                <User isMe={userData?.isMe}>
                    <UserData
                        avatar={userData?.avatar}
                        name={userData?.name}
                        location={userData?.location}
                        avatarSize={70}
                        nameSize={24}
                        locationSize={20}
                    />
                    <Buttons>
                        {userData?.isMe ? (
                            <>
                                {!userData?.socialLogin ? (
                                    <Button
                                        text="정보 수정"
                                        onClick={sendUserEdit}
                                    />
                                ) : null}
                                <Button
                                    text="로그아웃"
                                    logout
                                    onClick={() => logUserOut(history)}
                                />
                            </>
                        ) : (
                            <Button text="대화하기" onClick={() => null} />
                        )}
                    </Buttons>
                </User>
                <Introduce>{userData?.introduce}</Introduce>
                <Items>
                    <Tabs>
                        <Tab isFocused={tabFocus} onClick={() => focusChange(true)}>
                            <span>판매 물건 ({userData?.itemCount})</span>
                            <div />
                        </Tab>
                        <Tab isFocused={!tabFocus} onClick={() => focusChange(false)}>
                            <span>관심 물건 ({userData?.likeCount})</span>
                            <div />
                        </Tab>
                    </Tabs>
                    <Flex>
                        {tabFocus ? (
                            userData?.items?.map(item =>
                                <DisplayItem
                                    key={item.id}
                                    {...item}
                                />
                            )
                        ) : (
                            userData?.likes?.map(item =>
                                <DisplayItem
                                    key={item.id}
                                    {...item}
                                />
                            )
                        )}
                    </Flex>
                </Items>
            </Container>
        </MainLayout>
    )
}

export default UserDetail