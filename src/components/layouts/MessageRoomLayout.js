/* 
작성자 : SJ
작성일 : 2022.01.14
수정일 : ------
*/

import { useReactiveVar } from '@apollo/client'
import { faDoorClosed } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import { darkModeVar, showChatRoomVar } from '../../utils/apollo'
import { colors } from '../../utils/styles'
import FontAwesomeBtn from '../shared/buttons/FontAwesomeBtn'

const Container = styled.div`
    position:fixed;
    overflow: hidden;
    bottom:5px;
    right:5px;
    background-color:${({ theme }) => theme.bgColor} ;
    width:100%;
    max-width:300px;
    height:100%;
    max-height:400px;
    border:${colors.green} 1px solid;
    border-radius:15px;
    z-index:1;    
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
    padding-bottom:80px;
    bottom:0;
`

export default function MessageLayout({ children, loading, title, closeFn, fetchMore }) {
    const [fetching, setFetching] = useState(false)
    const darkMode = useReactiveVar(darkModeVar)

    const fetchMoreMessages = async () => {
        // 추가 데이터를 로드하는 상태로 전환
        setFetching(true);
        await fetchMore()
        // 추가 데이터 로드 끝
        setFetching(false);
    };

    const room = useRef()

    const scroll = () => {
        const scrollHeight = room.current.scrollHeight;
        const scrollTop = room.current.scrollTop;
        const clientHeight = room.current.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight && fetching === false) {
            // 페이지 끝에 도달하면 추가 데이터를 받아온다
            fetchMoreMessages();
        }
    }

    return (
        loading ? (
            "wait..."
        ) : (
            <Container>
                <RoomInfo>
                    <RoomTitle>{title}</RoomTitle>
                    <FontAwesomeBtn
                        icon={faDoorClosed}
                        onClick={() => showChatRoomVar(false)}
                        color={darkMode ? colors.white : colors.black}
                    />
                </RoomInfo>
                <RoomMain onScroll={scroll} ref={room}>
                    {children}
                </RoomMain>
            </Container>
        )
    )
}