/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : 2022.01.16
*/

/* 
1. 선택한 방의 모든 메시지가 로드되는 곳이다.
2. MessageRoomLayout의 Infinite Scroll과 함께 pagination 구현
3. 실시간 메시지 수신을 위해 Apollo의 Subscription Operator 사용(cache 수정으로 즉각 반영했으나 같은 메시지가 여러개로 번지는 버그가 있음)
4. createMessage 구현(cache 수정으로 즉각 반영)
5. seeRoom 입장 시 readMessages 구현하여 안 읽은 메시지 0개로 바꾼다(cache 수정으로 즉각 반영).
*/

import { gql, useApolloClient, useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
import { chatRoomIdVar, chatUserIdVar } from '../../../utils/apollo';
import { MESSAGE_DEFAULT_FRAGMENT } from '../../../components/shared/utils/fragments';
import Message from '../../../components/main/messages/Message';
import MessageRoomLayout from '../../../components/layouts/MessageRoomLayout';
import CreateMessage from '../../../components/main/messages/CreateMessage';

const SEE_ROOM = gql`
    query seeRoom($roomId:Int,$userId:Int,$offset:Int){
        seeRoom(roomId:$roomId,userId:$userId){
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
`;

const READ_MESSAGES = gql`
    mutation readMessages($id:Int!){
        readMessages(id:$id){
            ok
            error
        }
    }
`;

const REALTIME_ROOM = gql`
    subscription realtimeRoom($id:Int!){
        realtimeRoom(id:$id){
            ...MessageDefaultFragment
        }
    }
    ${MESSAGE_DEFAULT_FRAGMENT}
`;

export default function SeeRoom() {
    const chatRoomId = useReactiveVar(chatRoomIdVar);
    const chatUserId = useReactiveVar(chatUserIdVar);
    const [messageData, setMessageData] = useState([]);

    // readMessages Mutation 구현부
    const updateReadMessages = (cache, { data }) => {
        const { readMessages: { ok, error } } = data;
        if (!ok) {
            alert(error);
            return;
        };
        cache.modify({
            id: `Room:${data?.seeRoom?.id}`,
            fields: {
                unreadCount(prev) {
                    return 0
                }
            }
        });
    }
    const [readMessages] = useMutation(READ_MESSAGES, {
        update: updateReadMessages
    });

    // 해당 Room의 Messages Data들을 가져오는 seeRoom Query 구현부
    const { data, loading, fetchMore, subscribeToMore } = useQuery(SEE_ROOM, {
        variables: {
            ...(chatRoomId && { roomId: parseInt(chatRoomId) }),
            ...(chatUserId && { userId: parseInt(chatUserId) }),
            offset: 0
        },
    });


    // 실시간으로 Message Data를 수신하는 realtimeRoom Subscription 구현부
    const { cache } = useApolloClient();
    const realtimeUpdate = (prevQuery, { subscriptionData }) => {
        const { data: { realtimeRoom: newMessage } } = subscriptionData;
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
            });
            cache.modify({
                id: `Room:${data?.seeRoom?.id}`,
                fields: {
                    messages(prev) {
                        const existingMessage = prev.find(aMessage => aMessage.__ref === incomingMessage.__ref)
                        if (existingMessage) return prev;
                        return [...prev, newMessage]
                    }
                }
            });
        };
    };

    /* 
    1. seeRoom Query가 로드되면 Messages들을 messageData state에 옮겨 담는다.
    2. readMessages Mutation을 실행시켜 Message들의 read 상태를 true로 바꾼다.
    3. 실시간 통신을 위한 웹소켓 subscribe를 open하고 Message 수신을 기다린다.
    */
    useEffect(() => {
        if (data?.seeRoom) {
            setMessageData(data?.seeRoom?.messages);
            readMessages({
                variables: {
                    id: data?.seeRoom?.id
                }
            });
            subscribeToMore({
                document: REALTIME_ROOM,
                variables: {
                    id: data?.seeRoom?.id
                },
                updateQuery: realtimeUpdate
            });
        };
    }, [data]);

    // 해당 방에서 상대방의 data를 갖기 위함이다.
    const { loggedInUser } = useLoggedInUser();
    const notMe = data?.seeRoom?.users?.find(user => user.id !== loggedInUser?.id);

    return (
        <MessageRoomLayout
            loading={loading}
            title={notMe ? `${notMe?.name}님과 대화중입니다.` : "대화를 시작합니다."}
            fetchMore={
                () => fetchMore({
                    variables: {
                        id: chatRoomId,
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
            <CreateMessage roomId={data?.seeRoom?.id} />
        </MessageRoomLayout>
    );
};