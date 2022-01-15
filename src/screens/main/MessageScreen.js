/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : 2022.01.14
*/

// Message 관련 Screen

import { useReactiveVar } from '@apollo/client'
import { chatRoomIdVar, chatUserIdVar } from '../../utils/apollo'
import MessageRoom from '../../components/main/messages/MessageRoom'
import MessageRoomLists from '../../components/main/messages/MessageRoomLists'

const MessageScreen = () => {
    const chatRoomId = useReactiveVar(chatRoomIdVar)
    const chatUserId = useReactiveVar(chatUserIdVar)
    return (
        chatRoomId > 0 || chatUserId > 0 ? (
            <MessageRoom />
        ) : (
            <MessageRoomLists />
        )
    )
}
export default MessageScreen