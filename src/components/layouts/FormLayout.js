/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.14
*/

/*
1. form이 들어가는 모든 Screen에 쓰일 Component
*/
import styled, { css } from 'styled-components'
import DarkmodeBtn from '../shared/buttons/DarkmodeBtn';
import Helmet from '../shared/utils/Helmet';
import propTypes from 'prop-types';
import FormBox from '../shared/form/FormBox';
import BaseContainer from './BaseContainer';

const Container = styled(BaseContainer)`
    margin-top:50px;
    align-items:center;
    // 로그인, 회원가입에 쓰인다면 화면 정중앙에 form을 위치시키기 위함
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
            <DarkmodeBtn />
        </>
    )
}

FormLayout.propTypes = {
    title: propTypes.string.isRequired,
    logo: propTypes.bool,
    auth: propTypes.bool,
}