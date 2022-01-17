/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

// prop으로 User의 avatar와 size를 prop으로 받아 활용하기 위함

import propTypes from 'prop-types';
import styled from 'styled-components';

const Img = styled.img`
`
export default function UserAvatar({ img, size }) {
    return (
        <Img
            src={img === null ? require("../../../images/default-avatar.jpg") : img}
            style={{
                width: size,
                height: size,
                borderRadius: size / 2
            }}
        />
    )
}

UserAvatar.propTypes = {
    img: propTypes.string,
    size: propTypes.number.isRequired,
}