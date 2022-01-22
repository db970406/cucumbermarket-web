/* 
작성자 : SJ
작성일 : 2022.01.16
수정일 : 2022.01.19
*/

// SeeRoom에서 사용할 CreateMessage Mutation Component

import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../../utils/styles';
import Input from '../../../components/shared/form/Input';
import InputWithFontAwesome from '../../../components/shared/form/InputWithFontAwesome';
import styled from 'styled-components';
import { chatRoomIdVar, chatUserIdVar, darkModeVar } from '../../../utils/apollo';
import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { MESSAGE_DEFAULT_FRAGMENT } from '../../shared/utils/fragments';
import { useForm } from 'react-hook-form';

const PositionAbsolute = styled.div`
    position:absolute;
    bottom:2px;
    width:100%;
    margin: 0 auto;
`;

const CREATE_MESSAGE = gql`
    mutation createMessage($payload:String!,$roomId:Int,$userId:Int){
        createMessage(payload:$payload,roomId:$roomId,userId:$userId){
            ...MessageDefaultFragment
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`;

export default function CreateMessage({ roomId }) {
    const darkMode = useReactiveVar(darkModeVar);
    const chatRoomId = useReactiveVar(chatRoomIdVar);
    const chatUserId = useReactiveVar(chatUserIdVar);
    const { register, handleSubmit, setValue } = useForm();

    // createMessage 구현부
    const updateCreateMessage = (cache, { data: { createMessage } }) => {
        if (createMessage.id) {
            cache.modify({
                id: `Room:${roomId}`,
                fields: {
                    messages(prev) {
                        return [...prev, createMessage]
                    },
                    unreadCount(prev) {
                        return prev + 1
                    }
                }
            });
            setValue("message", "");
        };
    }

    const [createMessage, { loading }] = useMutation(CREATE_MESSAGE, {
        update: updateCreateMessage
    });
    const onValid = ({ message }) => {
        if (loading) return;

        createMessage({
            variables: {
                payload: message,
                ...(chatRoomId && { roomId: parseInt(chatRoomId) }),
                ...(chatUserId && { userId: parseInt(chatUserId) }),
            }
        });
    };

    return (
        <PositionAbsolute>
            <InputWithFontAwesome
                icon={faArrowCircleUp}
                size={"lg"}
                onClick={handleSubmit(onValid)}
                color={darkMode ? colors.white : colors.black}
            >
                <Input
                    {...register("message", {
                        required: true,
                    })}
                    required
                />
            </InputWithFontAwesome>
        </PositionAbsolute>
    )
}