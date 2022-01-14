/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
*/

import UserData from '../users/UserData'

export default function ChatWithWho({ users, unreadCount }) {
    const counterPart = users.find(user => !user.isMe)

    return (
        <UserData
            avatar={counterPart?.avatar}
            avatarSize={30}
            name={counterPart?.name}
            nameSize={14}
            location={`${String(unreadCount)}개의 안 읽은 메시지`}
            locationSize={12}
        />
    )
}
