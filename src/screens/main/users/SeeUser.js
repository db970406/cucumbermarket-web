/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : 2022.01.21
*/

/*
1. 클릭한 User의 id를 받아 seeUser Query로 상세정보를 보여주는 페이지
2. Nested Routes를 이용하여 판매 목록과 관심 목록을 오고 갈 수 있게 구현하였다.
3. Reactive Variables인 chatUserIdVar을 이용하여 seeRoom을 on/off 할 수 있게 함 
*/

import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link, Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import styled, { css } from 'styled-components';
import DisplayItem from '../../../components/main/items/DisplayItem';
import MainLayout from "../../../components/layouts/MainLayout";
import UserData from '../../../components/main/users/UserData';
import Button from '../../../components/shared/buttons/Button';
import { ITEM_DISPLAY_FRAGMENT, USER_DEFAULT_FRAGMENT } from '../../../components/shared/utils/fragments';
import { chatUserIdVar, logUserOut } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import CreateRoom from '../../../components/main/messages/CreateRoom';
import SeeRoom from '../messages/SeeRoom';

const Container = styled.div`
    display:flex;
    flex-direction:column;
    max-width:1000px;
    margin:0 auto;
`;

const User = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:30px;
`;

const Items = styled.div`
    margin-top:30px;
`;

const Flex = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
    margin-top:20px;
`;

const Introduce = styled.span`
    font-size:16px;
`;

const Buttons = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    @media screen and (max-width: 550px) {
        display:none;
    }
`;

const Tabs = styled.p``;

const Tab = styled.button`
    ${({ isActive }) => isActive ?
        css`
        span{
            color:${colors.green};
            font-weight:600;
        }
        div{
            margin-top:7px;
            height:3px;
            background-color:${colors.green};
        }
    `:
        css`
        span{
            color:${({ theme }) => theme.color};
            font-weight:400;
        }
        div{
            display:none;
        }
    `
    }
    span{
        font-size: 14px;
        margin-left: 2px;
        padding:5px;
    }
    &:hover{
        span{
            color:${colors.green};
        }
    }
`;

const SEE_USER = gql`
    query seeUser($id: Int!){
        seeUser(id: $id){
            ...UserDefaultFragment
            location
            introduce
            isMe
            items{
                ...ItemDisplayFragment
            }
            likes{
                ...ItemDisplayFragment
            }
            itemCount
            likeCount
        }
    }
    ${USER_DEFAULT_FRAGMENT}
    ${ITEM_DISPLAY_FRAGMENT}
`;

const SeeUser = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState({});
    const history = useHistory();
    const chatUserId = useReactiveVar(chatUserIdVar);
    const nowSellingMatch = useRouteMatch(`/user/:id/now-selling`);
    const likesMatch = useRouteMatch(`/user/:id/likes`);
    const { data, loading } = useQuery(SEE_USER, {
        variables: {
            id: parseInt(id)
        }
    });

    const sendUserEdit = () => {
        return history.push(`/user/${userData?.id}/edit`, {
            avatar: userData?.avatar
        });
    };

    useEffect(() => {
        if (data?.seeUser)
            setUserData(data?.seeUser);
    }, [data]);
    return (
        <MainLayout title={`${userData?.name}님의 프로필`} loading={loading}>
            <Container>
                <User isMe={userData?.isMe}>
                    <UserData
                        avatar={userData?.avatar}
                        name={userData?.name}
                        location={userData?.location}
                        avatarSize={70}
                        nameSize={24}
                        locationSize={20}
                    />
                    <Buttons>
                        {userData?.isMe ? (
                            <>
                                {!userData?.socialLogin ? (
                                    <Button
                                        text="정보 수정"
                                        onClick={() => sendUserEdit()}
                                    />
                                ) : null}
                                <Button
                                    text="로그아웃"
                                    logout
                                    onClick={() => logUserOut(history)}
                                />
                            </>
                        ) : (
                            <CreateRoom
                                text="대화하기"
                                userId={userData?.id}
                            />
                        )}
                    </Buttons>
                </User>
                <Introduce>{userData?.introduce}</Introduce>
                <Items>
                    <Tabs>
                        <Link to={`/user/${id}/now-selling`}>
                            <Tab isActive={nowSellingMatch !== null}>
                                <span>판매 물건 ({userData?.itemCount})</span>
                                <div />
                            </Tab>
                        </Link>
                        <Link to={`/user/${id}/likes`}>
                            <Tab isActive={likesMatch !== null}>
                                <span>관심 물건 ({userData?.likeCount})</span>
                                <div />
                            </Tab>
                        </Link>
                    </Tabs>
                    <Flex>
                        <Switch>
                            <Route path={`/user/:id/now-selling`}>
                                {userData?.items?.map(item =>
                                    <DisplayItem
                                        key={item.id}
                                        {...item}
                                    />
                                )}
                            </Route>
                            <Route path={`/user/:id/likes`}>
                                {userData?.likes?.map(item =>
                                    <DisplayItem
                                        key={item.id}
                                        {...item}
                                    />
                                )}
                            </Route>
                        </Switch>
                    </Flex>
                </Items>
            </Container>
            {chatUserId ? (
                <SeeRoom />
            ) : null}
        </MainLayout>
    );
};

export default SeeUser;