/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : ------
*/

/*
1. MessageRoomLists에서 방을 퇴장할 수 있게 하기 위한 Component
*/

import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import FontAwesomeBtn from './FontAwesomeBtn';

const DELETE_ROOM = gql`
    mutation deleteRoom($id:Int!){
        deleteRoom(id:$id){
            ok
            error
        }
    }
`

export default function ExitRoom({ roomId }) {
    const darkMode = useReactiveVar(darkModeVar)

    const updateDeleteRoom = (cache, { data }) => {
        const { deleteRoom: { ok, error } } = data
        if (!ok) {
            alert(error);
            return;
        }
        cache.evict({
            id: `Room:${roomId}`
        })
    }

    const [deleteRoom] = useMutation(DELETE_ROOM, {
        variables: {
            id: parseInt(roomId)
        },
        update: updateDeleteRoom
    })

    return (
        <FontAwesomeBtn
            icon={faSignOutAlt}
            color={darkMode ? colors.white : colors.black}
            size={"lg"}
            onClick={deleteRoom}
        />
    )
}