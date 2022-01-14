/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : 2022.01.14
*/

import { gql, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import { darkModeVar, showChatRoomVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'
import MessageLayout from '../../layouts/MessageRoomLayout'
import Input from '../../shared/form/Input'
import InputWithFontAwesome from '../../shared/form/InputWithFontAwesome'
import { MESSAGE_DEFAULT_FRAGMENT } from '../../shared/utils/fragments'
import Message from './Message'


const PositionAbsolute = styled.div`
    position:absolute;
    bottom:2px;
    width:100%;
    margin: 0 auto;
`

const SEE_ROOM = gql`
    query seeRoom($id:Int!,$offset:Int){
        seeRoom(id:$id){
            id
            users{
                id
                name
            }
            messages(offset:$offset){
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

const REALTIME_ROOM = gql`
    subscription realtimeRoom($id:Int!){
        realtimeRoom(id:$id){
            ...MessageDefaultFragment
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`

const MessageRoom = ({ userId }) => {
    const darkMode = useReactiveVar(darkModeVar)

    const [messageData, setMessageData] = useState([])
    const { register, handleSubmit, setValue } = useForm()

    const { data, loading, fetchMore, subscribeToMore } = useQuery(SEE_ROOM, {
        variables: {
            id: userId,
            offset: 0
        }
    })

    const { cache } = useApolloClient()
    const realtimeUpdate = (prevQuery, { subscriptionData }) => {
        const { data: { realtimeRoom: newMessage } } = subscriptionData
        if (newMessage.id) {
            const incomingMessage = cache.writeFragment({
                id: `Message:${newMessage.id}`,
                fragment: gql`
                    fragment NewMessage on Message{
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
                `,
                data: newMessage
            })
            cache.modify({
                id: `Room:${data?.seeRoom?.id}`,
                fields: {
                    messages(prev) {
                        const existingMessage = prev.find(aMessage => aMessage.__ref === incomingMessage.__ref)
                        if (existingMessage) return prev;
                        return [...prev, newMessage]
                    }
                }
            })
        }
    }

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
            setValue("message", "")
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
        if (data) {
            setMessageData(data?.seeRoom?.messages)
            subscribeToMore({
                document: REALTIME_ROOM,
                variables: {
                    id: data?.seeRoom?.id
                },
                updateQuery: realtimeUpdate
            })
        }
    }, [data])

    const { loggedInUser } = useLoggedInUser()
    const notMe = data?.seeRoom?.users?.find(user => user.id !== loggedInUser?.id)
    return (
        <MessageLayout
            loading={loading}
            title={`${notMe?.name}님과 대화중입니다.`}
            fetchMore={
                () => fetchMore({
                    variables: {
                        id: userId,
                        offset: messageData?.length
                    }
                })
            }
        >
            {messageData?.map(message =>
                <Message
                    key={message?.id}
                    avatar={message?.user?.avatar}
                    avatarSize={35}
                    name={message?.user?.name}
                    nameSize={14}
                    isMine={message.isMine}
                    message={message.payload}
                />
            )}

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
        </MessageLayout>
    )
}
export default MessageRoom