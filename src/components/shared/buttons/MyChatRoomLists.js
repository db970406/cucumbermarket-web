/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : 2022.01.14
*/

import { gql, useLazyQuery, useReactiveVar } from '@apollo/client'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { showChatRoomVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'
import MessageLayout from '../../layouts/MessageRoomLayout'
import ChatWithWho from '../../main/messages/ChatWithWho'
import MessageRoom from '../../main/messages/MessageRoom'

const Button = styled.button`
    position:fixed;
    bottom:20px;
    right:20px;
    width:50px;
    height:50px;
    border-radius:25px;
    background-color:${colors.green};
`
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

export default function MyChatRooms() {
    const showChatRoom = useReactiveVar(showChatRoomVar)
    const [selectRoom, setSelectRoom] = useState(0)
    const [currentRooms, setCurrentRooms] = useState([])
    const [seeRooms, { data, loading }] = useLazyQuery(SEE_ROOMS)

    const getShowAllChatRooms = () => {
        showChatRoomVar(true)
        seeRooms()
    }

    useEffect(() => {
        if (showChatRoom && data) {
            setCurrentRooms(data?.seeRooms)
        }
    }, [data])

    let counterPart
    currentRooms?.find(room => {
        return counterPart = room.users.find(user => !user.isMe)
    })

    return (
        showChatRoom ? (
            selectRoom === 0 ? (
                <MessageLayout
                    loading={loading}
                    title={`${currentRooms?.length}개의 방이 존재합니다.`}
                >
                    {currentRooms?.map(room =>
                        <RoomList key={room.id} onClick={() => setSelectRoom(counterPart?.id)}>
                            <ChatWithWho
                                users={room.users}
                                unreadCount={room.unreadCount}
                            />
                            {room.unreadCount > 0 ? <UnreadSign /> : null}
                        </RoomList>
                    )}
                </MessageLayout>
            ) : (
                <MessageRoom userId={selectRoom} />
            )
        ) : (
            <Button onClick={getShowAllChatRooms}>
                <FontAwesomeIcon icon={faCommentDots} size="lg" color={colors.white} />
            </Button >
        )
    )
}