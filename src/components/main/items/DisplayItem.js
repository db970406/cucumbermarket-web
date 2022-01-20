/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.19
*/

/*
1. Home, SeeUser에 배치될 Item들의 형태
2. toggleLike(관심) 구현 및 cache 수정으로 즉각 결과 확인 가능
*/


import propTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import GetKoreanStyleDate from '../../../utils/GetKoreanStyleDate';
import UserData from '../users/UserData';
import LikeCount from './LikeCount';
import ToggleLike from './ToggleLike';

const Container = styled.div`
    box-shadow:4px 4px 10px rgba(0,0,0,0.2);
    border-radius:7px;
`
const PhotoCase = styled.div`
    width:200px;
    height:200px;
    overflow:hidden;
    border-radius:7px;
    &:hover{
        img{
            transform:scale(1.1);
        }
    }
`
const ItemPhoto = styled.img`
    transition:all 0.2s ease-in-out;
    width:100%;
    height:100%;
`
const MetaData = styled.div`
    padding:10px;
    display:flex;
    flex-direction:column;
`
const Title = styled.span`
    margin:3px 0 7px 0;
    font-size:16px;
    font-weight:700;
`


const DisplayItem = ({
    id,
    title,
    user,
    itemPhotos,
    isMine,
    likeCount,
    isLiked,
    createdAt
}) => {
    return (
        <Container>
            <Link to={`/item/${id}`}>
                <PhotoCase>
                    <ItemPhoto
                        src={itemPhotos[0]?.file}
                        alt={title}
                    />
                </PhotoCase>
            </Link>
            <MetaData>
                <Title>{title}</Title>
                {user ? (
                    <Link to={`/user/${user?.id}`}>
                        <UserData
                            avatar={user?.avatar}
                            name={user?.name}
                            location={user?.location}
                            avatarSize={30}
                            nameSize={14}
                            locationSize={12}
                        />
                    </Link>
                ) : null}
                <div>
                    {!isMine ? (
                        <ToggleLike
                            itemId={id}
                            isLiked={isLiked}
                            size={"lg"}
                        />
                    ) : null}
                    <LikeCount likeCount={`관심 : ${likeCount}`} size={12} />
                </div>
                <GetKoreanStyleDate milliSecond={createdAt} size={12} />
            </MetaData>
        </Container>
    )
}

DisplayItem.propTypes = {
    id: propTypes.number.isRequired,
    title: propTypes.string.isRequired,
    user: propTypes.shape({
        id: propTypes.number.isRequired,
        name: propTypes.string.isRequired,
        location: propTypes.string,
        avatar: propTypes.string,
    }),
    itemPhotos: propTypes.arrayOf(propTypes.shape({
        id: propTypes.number.isRequired,
        file: propTypes.string.isRequired,
    })),
    likeCount: propTypes.number.isRequired,
    isLiked: propTypes.bool.isRequired,
};

export default DisplayItem