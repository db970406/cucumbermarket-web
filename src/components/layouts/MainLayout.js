/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.19
*/

/*
1. 로그인 후 화면들에 쓰일 기본 레이아웃
2. Header와 DarkModeBtn, ChatListsBtn을 디폴트로 가진다.
*/

import { Helmet } from 'react-helmet-async';
import styled, { css, keyframes } from 'styled-components';
import propTypes from "prop-types"
import Header from '../main/users/Header';
import DarkmodeBtn from '../shared/buttons/DarkmodeBtn';
import BaseContainer from './BaseContainer';
import ChatListsBtn from '../shared/buttons/ChatListsBtn';
import { useReactiveVar } from '@apollo/client';
import { showChatListVar } from '../../utils/apollo';
import MessageScreen from '../../screens/main/messages/MessageScreen';

const Container = styled(BaseContainer)`
    margin-top:30px;
`

const loadingAnimation = keyframes`
    from{
        transform:rotate(0deg);
    }
    to{
        transform:rotate(360deg);
    }
`
const Loading = styled.div`
    margin: 0 auto;
    text-align:center;
    img{
        width:100px;
        height:100px;
        animation:${loadingAnimation} 2s linear infinite;
    }
    p{
        font-size:16px;
        margin-top:20px;
    }
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
                        <Loading>
                            <img
                                src={require("../../images/cucumber.png")}
                            />
                            <p>잠시만 기다려주세요..</p>
                        </Loading>
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