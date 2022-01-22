/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.14
*/

/*
1. 해당 프로젝트에서 가장 기본적인 Input Component
2. react-hook-form으로 설정한 validation 검사와 함께 쓰인다. border color를 다르게 부여하여 유저 사용성 고려
*/

import styled from 'styled-components';
import { colors } from '../../../utils/styles';

const Input = styled.input`
    width:100%;
    padding:8px 15px;
    border-radius:7px;
    margin:5px 0;
    &::placeholder{
        font-size:12px;
        color:${props => props.theme.themeGray};
    }   
    border:2px solid ${props => props.isError ? colors.red : props.theme.themeGray};
`;

export default Input;