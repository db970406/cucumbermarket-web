/* 
작성자 : SJ
작성일 : 2022.01.13
수정일 : ------
*/

/*
1. Message 말풍선 구현부로 seeRoom에게 user정보와 message를 넘겨받는다.
2. isMine prop을 styled-components로 넘겨 내 메시지인지 여부에 따라 다른 css를 부여한다.
*/

import styled from 'styled-components';
import propTypes from "prop-types";
import UserAvatar from '../users/UserAvatar';
import Username from '../users/Username';
import { colors } from '../../../utils/styles';

const Container = styled.div`
    display:flex;
    flex-direction:${({ isMine }) => isMine ? "row-reverse" : "row"};
    text-align:${({ isMine }) => isMine ? "right" : "left"};
    align-items:center;
    justify-content:flex-start;
    margin:10px;
`;

const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
    margin-left:3px;
`;

const MessageBubble = styled.div`
    background-color:${({ isMine }) => isMine ? colors.green : colors.orange};
    padding:10px;
    border-radius:7px;
    margin:5px;
    text-align:${({ isMine }) => isMine ? "right" : "left"};
`;

const MessageText = styled.span`    
    color:white;
    font-weight:600;
`;

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

Message.propTypes = {
    avatar: propTypes.string,
    name: propTypes.string,
    avatarSize: propTypes.number,
    nameSize: propTypes.number,
    isMine: propTypes.bool,
    message: propTypes.string
}
