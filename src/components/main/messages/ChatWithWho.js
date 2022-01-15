/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : 2022.01.15
*/

/* 
1. MessageRoomLists의 Component로 그 Room에 있는 users들의 정보를 받는다.
2. 내가 아닌 유저를 counterPart 변수에 담았다.
3. 그 counterPart의 정보가 있다면 UserData Component를 이용해서 반환 하였다.
4. counterPart 정보가 없다면 상대방이 퇴장한 것이므로 퇴장했다는 문구를 띄워준다.
*/

import UserData from '../users/UserData'
import propTypes from "prop-types"

export default function ChatWithWho({ onClick, users, unreadCount }) {

    // 채팅방 내 상대방의 정보를 counterPart 변수에 담는다.
    const counterPart = users.find(user => !user.isMe)

    // counterPart에 정보가 담겨있는 가에 따라 다르게 return
    return (
        counterPart ? (
            <UserData
                onClick={onClick}
                avatar={counterPart?.avatar}
                avatarSize={30}
                name={counterPart?.name}
                nameSize={14}
                location={`${String(unreadCount)}개의 안 읽은 메시지`}
                locationSize={12}
            />
        ) : (
            <div
                onClick={onClick}
                style={{
                    padding: 8
                }}
            >
                상대방이 퇴장한 방입니다.
            </div>
        )

    )
}

ChatWithWho.propTypes = {
    onClick: propTypes.func,
    users: propTypes.array,
    unreadCount: propTypes.number
}