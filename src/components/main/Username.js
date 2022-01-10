/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.10
*/

import styled from 'styled-components'
import propTypes from "prop-types"

const Name = styled.span`
`

export default function Username({ name, size }) {
    return (
        <Name
            style={{
                fontWeight: 500,
                fontSize: size,
                marginInline: 5
            }}
        >
            {name}
        </Name>
    )
}

Username.propTypes = {
    name: propTypes.string,
    size: propTypes.number.isRequired,
}