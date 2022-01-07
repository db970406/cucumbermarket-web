/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { Helmet } from 'react-helmet-async';
import styled, { css } from 'styled-components';
import propTypes from "prop-types"
import Header from './Header';
import Darkmode from '../shared/Darkmode';

const Container = styled.div`
    display:flex;
    flex-direction:column;
    height:100vh;
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

// 로그인 후 화면들에 쓰일 레이아웃
export default function MainLayout({ children, loading, title }) {
    return (
        <>
            <Container>
                <Helmet title={title} />
                <Header />
                <Body wait={Boolean(loading)}>
                    {loading ? (
                        <LoadingText>잠시만 기다려주세요!</LoadingText>
                    ) : children}
                </Body>
            </Container>
            <Darkmode />
        </>
    )
}

MainLayout.propTypes = {
    title: propTypes.string,
    loading: propTypes.bool,
}