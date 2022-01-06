/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import propTypes from "prop-types"

const Container = styled.div`

`
const LoadingText = styled.span`
    font-size:25px;
    font-weight:600;
    margin:20px;
`

// 로그인 후 화면들에 쓰일 레이아웃
export default function MainLayout({ children, loading, title }) {
    return (
        <Container>
            <Helmet title={title} />
            {loading ? (
                <LoadingText>잠시만 기다려주세요!</LoadingText>
            ) : children}
        </Container>
    )
}

MainLayout.propTypes = {
    title: propTypes.string.isRequired
}