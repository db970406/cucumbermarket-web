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
import UserAvatar from '../../components/main/UserAvatar'
import UserLocation from '../../components/main/UserLocation'
import Username from '../../components/main/Username'
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
const UserData = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-start;
    @media screen and (max-width: 550px) {
        display:none;
    }
`
const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:30px;
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
const NowSelling = styled.p`
    font-size:16px;
    span{
        color:${colors.green};
        font-size:20px;
    }
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
                    <UserData>
                        <UserAvatar img={userData?.avatar} size={70} />
                        <UserInfo>
                            <Username name={userData?.name} size={28} />
                            <UserLocation location={userData?.location} size={24} />
                        </UserInfo>
                    </UserData>
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
                    <NowSelling>
                        <span>{userData?.name}</span> 님이 판매중인 물건
                    </NowSelling>
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