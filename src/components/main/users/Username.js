/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.11
*/

// prop으로 User의 name과 size를 prop으로 받아 활용하기 위함


import styled from 'styled-components';
import propTypes from "prop-types";

const Name = styled.span``;

export default function Username({ name, size }) {
    return (
        <Name
            style={{
                fontWeight: 600,
                fontSize: size,
                marginInline: 5
            }}
        >
            {name}
        </Name>
    )
};

Username.propTypes = {
    name: propTypes.string,
    size: propTypes.number.isRequired,
};