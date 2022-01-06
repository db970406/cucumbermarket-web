/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import styled from 'styled-components'
import Darkmode from '../shared/Darkmode';
import Helmet from '../shared/Helmet';
import { colors } from "../../utils/styles";
import propTypes from 'prop-types';

const Container = styled.div`
    display:flex;
    height:100vh;
    justify-content:center;
    align-items:center;
    flex-direction:column;
`;

const MainBox = styled.div`
    max-width:350px;
    width:100%;
    border:${colors.green} 2px solid;
    border-radius:15px;
`

// 로그인 회원가입에 쓰일 레이아웃
export default function AuthLayout({ children, title }) {
    return (
        <>
            <Container>
                <Helmet title={title} />
                <MainBox>
                    {children}
                </MainBox>
            </Container>
            <Darkmode />
        </>
    )
}

AuthLayout.propTypes = {
    title: propTypes.string.isRequired
}