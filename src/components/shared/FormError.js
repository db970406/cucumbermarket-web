/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import styled from 'styled-components'
import { colors } from '../../utils/styles'

const ErrorContainer = styled.div`
    margin:5px 0;
`
const ErrorText = styled.span`
    color:${colors.red};
    font-size:12px;
    font-weight:400;
`

export default function FormError({ text }) {
    return (
        <ErrorContainer>
            <ErrorText>{text}</ErrorText>
        </ErrorContainer>
    )
}