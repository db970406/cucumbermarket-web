/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : ------
*/

// FormLayout에 쓰일 Component


import styled from 'styled-components';
import { colors } from '../../../utils/styles';

const FormBox = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    max-width:350px;
    width:100%;
    border:${colors.green} 2px solid;
    border-radius:15px;
    padding:20px;
`;

export default FormBox;