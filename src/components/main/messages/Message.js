/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : ------
*/

import styled from 'styled-components'
import propTypes from "prop-types"
import UserAvatar from '../users/UserAvatar'
import Username from '../users/Username'
import { colors } from '../../../utils/styles'

const Container = styled.div`
    display:flex;
    flex-direction:${({ isMine }) => isMine ? "row-reverse" : "row"};
    align-items:center;
    justify-content:flex-start;
    margin:10px;
`
const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:3px;
`
const MessageBubble = styled.div`
    background-color:${({ isMine }) => isMine ? colors.green : colors.orange};
    padding:10px;
    border-radius:7px;
    margin:5px;
    text-align:center;
`
const MessageText = styled.span`    
    color:white;
`

export default function Message({
    avatar,
    name,
    avatarSize,
    nameSize,
    isMine,
    message
}) {
    return (
        <Container isMine={isMine}>
            {isMine ? null : <UserAvatar img={avatar} size={avatarSize} />}
            <UserInfo>
                <Username name={name} size={nameSize} />
                <MessageBubble isMine={isMine}>
                    <MessageText>{message}</MessageText>
                </MessageBubble>
            </UserInfo>
        </Container>
    )
}
