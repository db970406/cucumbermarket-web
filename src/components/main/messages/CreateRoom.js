/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : 2022.01.16
*/

/*
1. UserDetail, ItemDetail에서 대화버튼 클릭 시 바로 Room에 접근할 수 있게 하기 위함
2. createRoom Mutation은 이미 생성된 방이 있으면 그 방을 retun하고 없으면 새로 방을 만들어 준다.
*/

import { gql, useMutation } from '@apollo/client';
import { chatUserIdVar } from "../../../utils/apollo"
import Button from '../../shared/buttons/Button';
import { MESSAGE_DEFAULT_FRAGMENT } from '../../shared/utils/fragments';
import propTypes from "prop-types"

const CREATE_ROOM = gql`
    mutation createRoom($id:Int!){
        createRoom(id:$id){
            id
            messages{
                ...MessageDefaultFragment
            }
            unreadCount
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`
export default function CreateRoom({ text, userId }) {

    // MessageRoom을 on하기 위한 함수
    const enterRoom = (userId) => chatUserIdVar(userId)

    const updateCreateRoom = (cache, { data }) => {
        const { createRoom } = data
        if (createRoom.id) {
            const newRoom = cache.writeFragment({
                id: `Room:${createRoom.id}`,
                fragment: gql`
                    fragment newRoom on Room{
                        id
                        messages{
                            id
                            payload
                            user{
                                id
                                name
                                avatar
                            }
                            isMine
                            read
                        }
                        unreadCount
                    }
                `,
                data: createRoom
            })
            cache.modify({
                id: "ROOT_QUERY",
                fields: {
                    seeRooms(prev) {
                        const checkAlreadyExists = prev.find(room => room.__ref === newRoom.__ref)
                        return checkAlreadyExists ? [...prev] : [newRoom, ...prev]
                    }
                }
            })
            enterRoom(userId)
        }
    }
    const [createRoom] = useMutation(CREATE_ROOM, {
        variables: {
            id: userId
        },
        update: updateCreateRoom
    })

    const makeRoom = () => createRoom()
    return (
        <Button
            text={text}
            onClick={makeRoom}
        />
    )
}

CreateRoom.propTypes = {
    text: propTypes.string,
    userId: propTypes.number
}