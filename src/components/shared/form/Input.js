/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import styled from 'styled-components';
import { colors } from '../../../utils/styles';

const Input = styled.input`
    width:100%;
    padding:10px 15px;
    border-radius:7px;
    margin:5px 0;
    &::placeholder{
        font-size:12px;
        color:${props => props.theme.themeGray};
    }   
    border:2px solid ${props => props.isError ? colors.red : props.theme.themeGray};
`
export default Input