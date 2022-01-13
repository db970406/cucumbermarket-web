/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : ------
*/

import { gql, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { faArrowCircleUp, faDoorClosed } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { darkModeVar, showChatRoomVar } from '../../../utils/apollo'
import { colors } from '../../../utils/styles'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import Input from '../../shared/form/Input'
import { MESSAGE_DEFAULT_FRAGMENT } from '../../shared/utils/fragments'
import Message from './Message'

const Container = styled.div`
    position:fixed;
    bottom:0;
    right:0;
    background-color:${({ theme }) => theme.bgColor} ;
    width:100%;
    max-width:300px;
    height:100%;
    max-height:400px;
    border:${colors.green} 1px solid;
    border-radius:15px;
    z-index:1;
`
const InputContainer = styled.div`
    // FontAwesomeBtn을 Input안에 있는 것 처럼 두게 하고 Input의 길이 조절을 위함
    margin:0 10px;
    display:flex;
    align-items:center;
    position:absolute;
    max-width:280px;
    width:100%;
    bottom:0;
    transition:all 0.3s ease-in-out;
    background-color:${props => props.theme.bgColor};
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
const RoomMain = styled.div`
    overflow:scroll;
    ::-webkit-scrollbar{
        display:none;
    };
    height:100%;
    padding-bottom:50px;
    bottom:0;
`

const SEE_ROOM = gql`
    query seeRoom($id:Int!,$offset:Int){
        seeRoom(id:$id){
            id
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
    const [fetching, setFetching] = useState(false)

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

    const room = useRef()
    const fetchMoreMessages = () => {
        // 추가 데이터를 로드하는 상태로 전환
        setFetching(true);
        fetchMore({
            variables: {
                id: userId,
                offset: messageData?.length
            }
        })
        // 추가 데이터 로드 끝
        setFetching(false);
    };

    const scroll = () => {
        const scrollHeight = room.current.scrollHeight;
        const scrollTop = room.current.scrollTop;
        const clientHeight = room.current.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
            // 페이지 끝에 도달하면 추가 데이터를 받아온다
            fetchMoreMessages();
        }
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
                <RoomMain onScroll={scroll} ref={room}>
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
                </RoomMain>

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