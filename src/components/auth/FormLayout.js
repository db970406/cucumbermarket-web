/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.10
*/

import styled from 'styled-components'
import Darkmode from '../shared/Darkmode';
import Helmet from '../shared/Helmet';
import propTypes from 'prop-types';
import FormBox from './FormBox';
import BaseContainer from '../shared/BaseContainer';

const Container = styled(BaseContainer)`
    height:100vh;
    justify-content:center;
    align-items:center;
`;

const Logo = styled.img`
    max-width:40%;
    height:70px;
    margin : 0 auto;
    margin-bottom:10px;
`

// 로그인 회원가입에 쓰일 레이아웃
export default function FormLayout({ children, title }) {
    return (
        <>
            <Container>
                <Helmet title={title} />
                <FormBox>
                    <Logo src={require("../../images/cucumber.png")} />
                    {children}
                </FormBox>
            </Container>
            <Darkmode />
        </>
    )
}

FormLayout.propTypes = {
    title: propTypes.string.isRequired
}