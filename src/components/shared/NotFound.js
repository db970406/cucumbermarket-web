/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../../utils/styles'

const Container = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    height:100vh;
`
const Warning = styled.h1`
    font-size:60px;
    font-weight:800;
`
const Subscription = styled.span`
    font-weight:600;
    font-size:25px;
    margin:20px 0;
    color:${props => props.link ? colors.green : undefined};
`

// Route에서 정하지 않은 URL로 이동 시 띄워줄 화면
export default function NotFound() {
    return (
        <Container>
            <Warning>404 NOT FOUND!</Warning>
            <Subscription>존재하지 않는 페이지입니다.</Subscription>
            <Link to="/">
                <Subscription link={true}>홈으로 돌아가기 &rarr;</Subscription>
            </Link>
        </Container>
    )
}