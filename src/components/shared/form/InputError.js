/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.11
*/

import styled from 'styled-components'
import { colors } from '../../../utils/styles'
import propTypes from "prop-types"

const ErrorText = styled.span`
    color:${colors.red};
    font-size:12px;
    font-weight:400;
    margin:5px 0;

`

export default function InputError({ text }) {
    return (
        <ErrorText>{text}</ErrorText>
    )
}

InputError.propTypes = {
    text: propTypes.string
}