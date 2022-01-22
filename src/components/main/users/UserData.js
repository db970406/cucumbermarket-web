/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.14
*/

/* 
1. 같이 자주 쓰는 UserAvatar, UserLocation, Username Component들을 한 곳에 모아 편하게 사용하기 위함
2. onClick으로 함수를 prop으로 받아 처리할 수 있다.
*/

import styled from 'styled-components';
import UserAvatar from './UserAvatar';
import UserLocation from './UserLocation';
import Username from './Username';
import propTypes from "prop-types";

const Container = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-start;
    margin:7px 0;
    cursor:pointer;
`;

const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:3px;
`;

export default function UserData({
    avatar,
    name,
    location,
    avatarSize,
    nameSize,
    locationSize,
    onClick
}) {
    return (
        <Container onClick={onClick}>
            <UserAvatar img={avatar} size={avatarSize} />
            <UserInfo>
                <Username name={name} size={nameSize} />
                <UserLocation location={location} size={locationSize} />
            </UserInfo>
        </Container>
    )
}

UserData.propTypes = {
    avatar: propTypes.string,
    name: propTypes.string,
    location: propTypes.string,
    avatarSize: propTypes.number,
    nameSize: propTypes.number,
    locationSize: propTypes.number,
};