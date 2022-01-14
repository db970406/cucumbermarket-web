/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
*/

import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { chatRoomIdVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'
import MessageLayout from '../../layouts/MessageRoomLayout'
import ChatWithWho from './ChatWithWho'

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

export default function MessageRoomLists() {
    const [currentRooms, setCurrentRooms] = useState([])

    const { data, loading } = useQuery(SEE_ROOMS)

    useEffect(() => {
        if (data?.seeRooms) {
            setCurrentRooms(data?.seeRooms)
        }
    }, [data])

    const enterRoom = (roomId) => chatRoomIdVar(roomId)

    return (
        <MessageLayout
            loading={loading}
            title={`${currentRooms?.length}개의 방이 존재합니다.`}
        >
            {currentRooms?.map(room =>
                <RoomList key={room.id} onClick={() => enterRoom(room.id)}>
                    <ChatWithWho
                        users={room.users}
                        unreadCount={room.unreadCount}
                    />
                    {room.unreadCount > 0 ? <UnreadSign /> : null}
                </RoomList>
            )}
        </MessageLayout>
    )
}