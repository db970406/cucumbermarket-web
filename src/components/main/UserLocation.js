/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.10
*/

import styled from 'styled-components'
import propTypes from "prop-types"

const Location = styled.span`
`

export default function UserLocation({ location, size }) {
    return (
        <Location
            style={{
                fontWeight: 300,
                fontSize: size,
                marginInline: 5,
                marginTop: 5,
            }}
        >
            {location}
        </Location>
    )
}

UserLocation.propTypes = {
    location: propTypes.string,
    size: propTypes.number.isRequired,
}