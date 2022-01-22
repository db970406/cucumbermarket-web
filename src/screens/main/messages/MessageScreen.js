/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : 2022.01.14
*/

// Reactive Variable에 따라 어떤 Message Screen을 띄워줄 것인지 결정하는 Component

import { useReactiveVar } from '@apollo/client';
import { chatRoomIdVar, chatUserIdVar } from '../../../utils/apollo';
import SeeRoom from './SeeRoom';
import SeeRooms from "./SeeRooms";

const MessageScreen = () => {
    const chatRoomId = useReactiveVar(chatRoomIdVar);
    const chatUserId = useReactiveVar(chatUserIdVar);
    return (
        chatRoomId > 0 || chatUserId > 0 ? (
            <SeeRoom />
        ) : (
            <SeeRooms />
        )
    );
};
export default MessageScreen;