/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : 2022.01.10
*/
// 유저의 상세정보를 보여주는 페이지

import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DisplayItem from '../../components/main/DisplayItem'
import MainLayout from "../../components/main/MainLayout"
import UserData from '../../components/main/UserData'
import Button from '../../components/shared/Button'
import { USER_DEFAULT_FRAGMENT } from '../../components/shared/fragments'
import { logUserOut } from '../../utils/apollo'
import { colors } from '../../utils/styles'

const Container = styled.div`
    display:flex;
    flex-direction:column;
    max-width:1000px;
    margin:0 auto;
`

const Flex = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
    margin-top:20px;
`
const Top = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:30px;
`
const Bottom = styled.div`
    margin-top:30px;
`
const Buttons = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
`
const Introduce = styled.span`
    font-size:16px;
`
const Tabs = styled.p`
    font-size:16px;
    span{
        color:${colors.green};
        font-size:20px;
    }
`
const Tab = styled.button`
    color:${colors.green};
    font-size:16px;
`

const SEE_USER = gql`
    query seeUser($id:Int!){
        seeUser(id:$id){
            ...UserDefaultFragment
            location
            introduce
            isMe
            items{
                id
                title
                itemPhotos{
                    id
                    file
                }
                isMine
                likeCount
                isLiked
            }
            itemCount
            likeCount
        }
    }
    ${USER_DEFAULT_FRAGMENT}
`

const UserDetail = () => {
    const { id } = useParams()
    const [userData, setUserData] = useState({})
    const history = useHistory()

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
                <Top isMe={userData?.isMe}>
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
                </Top>
                <Introduce>{userData?.introduce}</Introduce>
                <Bottom>
                    <Tabs>
                        <span>{userData?.name}</span>님의
                        <Tab>
                            판매 물건
                            <span>( {userData?.itemCount} )</span>
                        </Tab>
                        <Tab>
                            관심 물건
                            <span> ( {userData?.likeCount} )</span>
                        </Tab>
                    </Tabs>
                    <Flex>
                        {userData?.items?.map(item =>
                            <DisplayItem
                                key={item.id}
                                {...item}
                            />
                        )}
                    </Flex>
                </Bottom>
            </Container>
        </MainLayout>
    )
}

export default UserDetail