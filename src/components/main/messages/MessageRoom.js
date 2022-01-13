/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : ------
*/

import { gql, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { faArrowCircleUp, faDoorClosed } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { darkModeVar, showChatRoomVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import Input from '../../shared/form/Input'
import { MESSAGE_DEFAULT_FRAGMENT } from '../../shared/utils/fragments'
import Message from './Message'

const Container = styled.div`
    background-color:${({ theme }) => theme.bgColor} ;
    max-width:300px;
    width:100%;
    max-height:400px;
    height:100%;
    border:${colors.green} 1px solid;
    border-radius:15px;
    position:fixed;
    bottom:5px;
    right:5px;
`
const InputContainer = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하고 Input의 길이 조절을 위함
    margin:0 10px;
    display:flex;
    align-items:center;
    position:fixed;
    max-width:280px;
    width:100%;
    bottom:10px;
    transition:all 0.3s ease-in-out;
`
const SearchBtn = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하기 위함
    position:absolute;
    right:10px;
`

const RoomInfo = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 15px;
    border-bottom:${props => props.theme.themeGray} 1px solid; ;
`
const RoomTitle = styled.span`
    font-size:14px;
`

const SEE_ROOM = gql`
    query seeRoom($id:Int!){
        seeRoom(id:$id){
            id
            messages{
                ...MessageDefaultFragment
            }
            unreadCount
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`
const CREATE_MESSAGE = gql`
    mutation createMessage($payload:String!,$roomId:Int,$userId:Int){
        createMessage(payload:$payload,roomId:$roomId,userId:$userId){
            ...MessageDefaultFragment
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`

const MessageRoom = ({ userId }) => {
    const darkMode = useReactiveVar(darkModeVar)
    const [messageData, setMessageData] = useState([])
    const { register, handleSubmit } = useForm()


    const { data, loading } = useQuery(SEE_ROOM, {
        variables: {
            id: userId
        }
    })

    const updateCreateMessage = (cache, { data: { createMessage } }) => {
        if (createMessage.id) {
            cache.modify({
                id: `Room:${data?.seeRoom?.id}`,
                fields: {
                    messages(prev) {
                        return [...prev, createMessage]
                    }
                }
            })
        }
    }

    const [createMessage, { loading: sendLoading }] = useMutation(CREATE_MESSAGE, {
        update: updateCreateMessage
    })

    const onValid = ({ message }) => {
        if (sendLoading) return;

        createMessage({
            variables: {
                payload: message,
                userId
            }
        })
    }


    useEffect(() => {
        setMessageData(data?.seeRoom?.messages)
    }, [data])
    return (
        loading ? (
            "wait..."
        ) : (
            <Container>
                <RoomInfo>
                    <RoomTitle>대화중입니다.</RoomTitle>
                    <FontAwesomeBtn
                        icon={faDoorClosed}
                        onClick={() => showChatRoomVar(false)}
                        color={darkMode ? colors.white : colors.black}
                    />
                </RoomInfo>
                {messageData?.map(message =>
                    <Message
                        key={message.id}
                        avatar={message.user.avatar}
                        avatarSize={35}
                        name={message.user.name}
                        nameSize={14}
                        isMine={message.isMine}
                        message={message.payload}
                    />
                )}

                <InputContainer>
                    <Input
                        {...register("message", {
                            required: true,
                        })}
                        required
                    />
                    <SearchBtn>
                        <FontAwesomeBtn
                            icon={faArrowCircleUp}
                            size={"lg"}
                            onClick={handleSubmit(onValid)}
                            color={darkMode ? colors.white : colors.black}
                        />
                    </SearchBtn>
                </InputContainer>
            </Container>
        )
    )
}
export default MessageRoom