/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.21
*/

/* 
1. 클릭한 Item의 id를 받아 seeItem Query로 상세정보를 보여주는 페이지
2. Reactive Variable인 chatUserIdVar을 이용하여 seeRoom을 on/off 할 수 있게 함
*/

import { useParams } from "react-router-dom";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { ITEM_DETAIL_FRAGMENT } from '../../../components/shared/utils/fragments';
import MainLayout from '../../../components/layouts/MainLayout';
import styled from 'styled-components';
import { chatUserIdVar } from '../../../utils/apollo';
import { useState } from 'react';
import { Link } from "react-router-dom";
import PhotoSlider from '../../../components/main/items/PhotoSlider';
import ItemPhoto from '../../../components/main/items/ItemPhoto';
import UserData from '../../../components/main/users/UserData';
import DropDownMenu from '../../../components/main/items/DropDownMenu';
import MessageRoom from '../messages/MessageScreen';
import CreateRoom from '../../../components/main/messages/CreateRoom';
import ToggleLike from '../../../components/main/items/ToggleLike';
import GetKoreanStyleDate from '../../../utils/GetKoreanStyleDate';
import LikeCount from '../../../components/main/items/LikeCount';

const Container = styled.div`
    display:flex;
    flex-direction:column;
    flex:1;
    justify-content:center;
    border-radius:20px;
    margin : 0 auto;
    margin-top:30px;
    max-width:700px;
    margin-bottom:30px;
`;

const Header = styled.header`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:10px;
    justify-content:space-between;
`;

const Title = styled.h4`
    font-size:24px;
    font-weight:700;
    margin-bottom:5px;
`;

const MetaData = styled.div`
    padding:15px;
    width:100%;
`;

const Buttons = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
`;

const Description = styled.p`
    margin:20px 0px 10px 0;
    font-size:14px;
    // 콘텐츠가 다음 줄로 넘어가고 필요한 경우 단어 줄 바꿈이 발생한다.
    word-wrap: break-word;
`;


export const SEE_ITEM = gql`
    query seeItem($id:Int!){
        seeItem(id:$id){
            ...ItemDetailFragment
        }
    }
    ${ITEM_DETAIL_FRAGMENT}
`;

export default function SeeItem() {
    const chatUserId = useReactiveVar(chatUserIdVar);
    const [itemData, setItemData] = useState({});

    // 파라미터에서 id를 뽑아 resolver의 variables로 줄 것이다.
    const { id } = useParams();

    const seeItemCompleted = ({ seeItem }) => setItemData(seeItem);
    const { loading } = useQuery(SEE_ITEM, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: seeItemCompleted
    });

    return (
        <MainLayout title={itemData?.title} loading={loading}>
            <Container>
                <Header>
                    <Link to={`/user/${itemData?.user?.id}/now-selling`}>
                        <UserData
                            avatar={itemData?.user?.avatar}
                            name={itemData?.user?.name}
                            location={itemData?.user?.location}
                            avatarSize={40}
                            nameSize={16}
                            locationSize={14}
                        />
                    </Link>
                    {itemData?.isMine ? (
                        <DropDownMenu
                            link1={
                                <Link to={`/item/${itemData?.id}/edit`}>
                                    수정하기
                                </Link>
                            }
                            link2={
                                <Link to={`/item/${itemData?.id}/delete`}>
                                    삭제하기
                                </Link>
                            }
                        />
                    ) : null}
                </Header>
                <PhotoSlider>
                    {itemData?.itemPhotos?.map(photo =>
                        <ItemPhoto
                            key={photo.id}
                            src={photo.file}
                            alt={itemData?.title}
                            maxHeight={500}
                        />
                    )}
                </PhotoSlider>
                <MetaData>
                    <Title>{itemData?.title}</Title>
                    {!itemData?.isMine ? (
                        <Buttons>
                            <ToggleLike
                                isLiked={itemData?.isLiked}
                                itemId={itemData?.id}
                                size={"2x"}
                            />

                            <CreateRoom
                                text="실시간 대화"
                                userId={itemData?.user?.id}
                            />
                        </Buttons>
                    ) : null}
                    <LikeCount likeCount={`${itemData?.likeCount} 개의 관심`} size={14} />
                    <Description>
                        {itemData?.description}
                    </Description>
                    <GetKoreanStyleDate milliSecond={itemData?.createdAt} size={14} />
                </MetaData>
            </Container>
            {chatUserId ? (
                <MessageRoom />
            ) : null}
        </MainLayout>
    );
};