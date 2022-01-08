/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : ------
*/
// 유저의 상세정보를 보여주는 페이지

import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import DisplayItem from '../../components/main/home/DisplayItem'
import MainLayout from "../../components/main/MainLayout"
import UserAvatar from '../../components/main/UserAvatar'
import UserLocation from '../../components/main/UserLocation'
import Username from '../../components/main/Username'
import Button from '../../components/shared/Button'
import { USER_DEFAULT_FRAGMENT } from '../../components/shared/fragments'
import { logUserOut } from '../../utils/apollo'

const Container = styled.div`
    display:flex;
    flex-direction:column;
    max-width:1000px;
    margin:0 auto;
`
const UserData = styled.div`
    display:flex;
    align-items:center;
    padding:20px;
    justify-content:flex-start;
    
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
    padding:20px;
`
const Top = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:20px;
`
const Bottom = styled.div`

`
const Buttons = styled.div`
    display:flex;
    flex-direction:column;
`
const Introduce = styled.span`
    padding:20px;
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
            
        }
    }
    ${USER_DEFAULT_FRAGMENT}
`

const UserDetail = () => {
    const { id } = useParams()
    const [userData, setUserData] = useState({})
    const history = useHistory()

    const { data, loading } = useQuery(SEE_USER, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: ({ seeUser }) => setUserData(seeUser)
    })

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
                                <Button
                                    text="정보 수정"
                                    onClick={() => history.push(`/user/${userData?.id}/edit`)}
                                />
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
                <Bottom>
                    <Introduce>{userData?.introduce}</Introduce>
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