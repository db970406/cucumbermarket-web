/* 
작성자 : SJ
작성일 : 2022.01.10
수정일 : 2022.01.13
*/

import styled from 'styled-components'
import UserAvatar from './UserAvatar'
import UserLocation from './UserLocation'
import Username from './Username'
import propTypes from "prop-types"

const Container = styled.div`
    display:flex;
    align-items:center;
    justify-content:flex-start;
    margin:7px 0;
    @media screen and (max-width: 550px) {
        display:none;
    }
`
const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:3px;
`

export default function UserData({
    avatar,
    name,
    location,
    avatarSize,
    nameSize,
    locationSize,
}) {
    return (
        <Container>
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
}