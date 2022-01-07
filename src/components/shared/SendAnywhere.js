/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import propTypes from "prop-types"
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors } from '../../utils/styles'

const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    margin:0 auto;
    margin-top:12px;
`
const Description = styled.span`
    font-size:12px;
    margin-right:7px;
`
const Where = styled.span`
    font-size:14px;
    &:hover{
        text-decoration:underline;
    };
    color:${colors.green};
`

export default function SendAnywhere({ description, where, link }) {
    return (
        <Container>
            <Description>{description}</Description>
            <Link to={link}>
                <Where>{where}</Where>
            </Link>
        </Container>
    )
}

SendAnywhere.propTypes = {
    description: propTypes.string.isRequired,
    where: propTypes.string.isRequired,
    link: propTypes.string.isRequired,
}