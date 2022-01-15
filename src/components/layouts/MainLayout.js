/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.15
*/

/*
1. Authentication 후 화면들에 쓰일 기본 레이아웃
2. Header와 DarkModeBtn, ChatBtn을 디폴트로 가진다.
*/

import { Helmet } from 'react-helmet-async';
import styled, { css } from 'styled-components';
import propTypes from "prop-types"
import Header from '../main/users/Header';
import DarkmodeBtn from '../shared/buttons/DarkmodeBtn';
import BaseContainer from './BaseContainer';
import ChatListsBtn from '../shared/buttons/ChatListsBtn';
import { useReactiveVar } from '@apollo/client';
import { showChatListVar } from '../../utils/apollo';
import MessageScreen from '../../screens/main/MessageScreen';

const Container = styled(BaseContainer)`
    margin-top:30px;
`
const LoadingText = styled.span`
    font-size:25px;
    font-weight:600;
    margin:20px;
`
const Body = styled.div`
    margin:0 80px;
    ${({ wait }) => wait && css`
        display:flex;
        flex:1;
        justify-content:center;
        align-items:center;
        height:100vh;
    `}
`

export default function MainLayout({ children, loading, title }) {
    const showChatList = useReactiveVar(showChatListVar)

    return (
        <>
            <Header />
            <Container>
                <Helmet title={title} />
                <Body wait={Boolean(loading)}>
                    {loading ? (
                        <LoadingText>잠시만 기다려주세요!</LoadingText>
                    ) : children}
                </Body>
            </Container>
            {showChatList ? (
                <MessageScreen />
            ) : (
                <ChatListsBtn />
            )}
            <DarkmodeBtn />
        </>
    )
}

MainLayout.propTypes = {
    title: propTypes.string,
    loading: propTypes.bool,
}