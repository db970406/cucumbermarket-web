/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

import propTypes from 'prop-types';
import styled from 'styled-components';

export default function UserAvatar({ img, size }) {
    const Img = styled.img`
        width:${size}px;
        height:${size}px;
        border-radius:${size / 2}px;   
    `
    return <Img src={img === null ? require("../../images/default-avatar.jpg") : img} />
}

UserAvatar.propTypes = {
    img: propTypes.string,
    size: propTypes.number.isRequired,
}