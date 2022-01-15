/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
*/

/* 
1. MessageRoomLists의 Component로 그 Room에 있는 users들의 정보를 받는다.
2. 내가 아닌 유저를 counterPart 변수에 담았다.
3. 그 counterPart의 정보를 UserData Component를 이용해서 반환 하였다.
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
