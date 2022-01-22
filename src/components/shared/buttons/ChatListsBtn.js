/* 
작성자 : SJ
작성일 : 2022.01.11
수정일 : 2022.01.15
*/

/* 
1. MainLayout의 Component
2. position:fixed로 우측 하단 위치 고정
3. 유저가 읽지 않은 모든 messages들의 unreadCount를 더하여 버튼에 띄워준다.
*/

import { gql, useQuery } from '@apollo/client';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { showChatListVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';

const Button = styled.button`
    position:fixed;
    bottom:20px;
    right:20px;
    width:50px;
    height:50px;
    border-radius:25px;
    background-color:${colors.green};
`;

const UnreadCount = styled.div`
    position:absolute;
    display:flex;
    justify-content:center;
    align-items:center;
    bottom:25px;
    right: 10px;
    width:10px;
    height:10px;
    border-radius:8px;
    padding:8px;
    background-color:${colors.pink} ;
    text-align:center;
    span{
        font-size:10px;
    };
`;


const SEE_ROOMS = gql`
    query seeRooms{
        seeRooms{
            unreadCount
        }
    }
`;

export default function ChatListsBtn() {
    const [unreadCount, setUnreadCount] = useState(0);

    // seeRooms로부터 unreadCount만 받아서 사용할 것이다.
    const { data } = useQuery(SEE_ROOMS);

    // seeRooms data가 로드되면 모든 room의 unreadCount을 더하여 unreadCount state에 담아준다.
    useEffect(() => {
        if (data?.seeRooms?.length > 0) {
            // seeRooms data 배열 속에 있는 모든 unreadCount를 더하는 함수(reduce)
            const unreadCountArray = data?.seeRooms?.map(room => room.unreadCount);
            const sumTotal = unreadCountArray?.reduce((a, b) => (a + b));
            setUnreadCount(sumTotal);
        }
    }, [data]);
    return (
        <Button onClick={() => showChatListVar(true)}>
            <FontAwesomeIcon icon={faCommentDots} size="lg" color={colors.white} />
            {unreadCount ? (
                <UnreadCount>
                    <span>{unreadCount}</span>
                </UnreadCount>
            ) : null}
        </Button >
    )
};