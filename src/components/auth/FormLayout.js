/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.10
*/

import styled, { css } from 'styled-components'
import Darkmode from '../shared/Darkmode';
import Helmet from '../shared/Helmet';
import propTypes from 'prop-types';
import FormBox from './FormBox';
import BaseContainer from '../shared/BaseContainer';

const Container = styled(BaseContainer)`
    margin-top:50px;
    align-items:center;
    ${({ auth }) => auth ? css`
        justify-content:center;
        height:100vh;
    `: css`
        justify-content:flex-start;
    `}
`;

const Logo = styled.img`
    max-width:40%;
    height:70px;
    margin : 0 auto;
    margin-bottom:10px;
`

// 로그인 회원가입에 쓰일 레이아웃
export default function FormLayout({ children, title, logo, auth }) {
    return (
        <>
            <Container auth={auth}>
                <Helmet title={title} />
                <FormBox>
                    {logo ? <Logo src={require("../../images/cucumber.png")} /> : null}
                    {children}
                </FormBox>
            </Container>
            <Darkmode />
        </>
    )
}

FormLayout.propTypes = {
    title: propTypes.string.isRequired,
    logo: propTypes.bool,
    auth: propTypes.bool,
}