/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

import styled from 'styled-components'


export default function Username({ name, size }) {
    const Name = styled.span`
        font-weight:600;
        font-size:${size};
        margin:0 5px;
    `
    return (
        <Name>{name}</Name>
    )
}