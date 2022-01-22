/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.11
*/

// prop으로 User의 location와 size를 prop으로 받아 활용하기 위함

import styled from 'styled-components';
import propTypes from "prop-types";

const Location = styled.span``;

export default function UserLocation({ location, size }) {
    return (
        <Location
            style={{
                fontWeight: 500,
                fontSize: size,
                marginInline: 5,
                marginTop: 5,
            }}
        >
            {location}
        </Location>
    )
};

UserLocation.propTypes = {
    location: propTypes.string,
    size: propTypes.number.isRequired,
};