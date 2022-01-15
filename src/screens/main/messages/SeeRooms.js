/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
*/

/* 
1. 현재 로그인한 유저가 속한 Rooms들의 List들을 띄워주는 Component이다.
2. 새 메시지 알림기능(UnreadSign)
3. ExitRoomBtn 추가
*/

import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import MessageRoomLayout from '../../../components/layouts/MessageRoomLayout'
import ChatWithWho from '../../../components/main/messages/ChatWithWho'
import DeleteRoomBtn from '../../../components/main/messages/DeleteRoomBtn'
import { chatRoomIdVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'

const RoomList = styled.div`
    padding:8px 10px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:1px solid ${({ theme }) => theme.themeGray};
    cursor:pointer;
`
const UnreadSign = styled.div`
    width:10px;
    height:10px;
    border-radius:5px;
    background-color: ${colors.green};
`

const SEE_ROOMS = gql`
    query seeRooms{
        seeRooms{
            id
            users{
                id
                name
                avatar
                isMe
            }
            unreadCount
        }
    }
`

export default function SeeRooms() {
    const [currentRooms, setCurrentRooms] = useState([])

    const { data, loading } = useQuery(SEE_ROOMS)

    useEffect(() => {
        if (data?.seeRooms) {
            setCurrentRooms(data?.seeRooms)
        }
    }, [data])

    const enterRoom = (roomId) => chatRoomIdVar(roomId)

    return (
        <MessageRoomLayout
            loading={loading}
            title={`${currentRooms?.length}개의 방이 존재합니다.`}
        >
            {currentRooms?.map(room =>
                <RoomList key={room.id}>
                    <ChatWithWho
                        onClick={() => enterRoom(room.id)}
                        users={room.users}
                        unreadCount={room.unreadCount}
                    />
                    {room.unreadCount > 0 ? <UnreadSign /> : null}
                    <DeleteRoomBtn roomId={room.id} />
                </RoomList>
            )}
        </MessageRoomLayout>
    )
}