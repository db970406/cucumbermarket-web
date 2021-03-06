/* 
작성자 : SJ
작성일 : 2022.01.15
수정일 : 2022.01.16
*/

// seeRooms에서 사용할 DeleteRoom Mutation Component

import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn';
import propTypes from "prop-types";

const DELETE_ROOM = gql`
    mutation deleteRoom($id:Int!){
        deleteRoom(id:$id){
            ok
            error
        }
    }
`;

export default function DeleteRoom({ roomId }) {
    const darkMode = useReactiveVar(darkModeVar);

    // deleteRoom Mutation과 그 cache 수정
    const updateDeleteRoom = (cache, { data }) => {
        const { deleteRoom: { ok, error } } = data;
        if (!ok) {
            alert(error);
            return;
        };
        cache.evict({
            id: `Room:${roomId}`
        });
    }
    const [deleteRoom] = useMutation(DELETE_ROOM, {
        variables: {
            id: parseInt(roomId)
        },
        update: updateDeleteRoom
    });

    return (
        <FontAwesomeBtn
            icon={faSignOutAlt}
            color={darkMode ? colors.white : colors.black}
            size={"lg"}
            onClick={deleteRoom}
        />
    )
}

DeleteRoom.propTypes = {
    roomId: propTypes.number
}