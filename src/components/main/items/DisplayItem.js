/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.18
*/

/*
1. Home, SeeUser에 배치될 Item들의 형태
2. toggleLike(관심) 구현 및 cache 수정으로 즉각 결과 확인 가능
*/


import propTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import UserData from '../users/UserData';
import ToggleLike from './ToggleLike';

const Container = styled.div`
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
    padding:7px;
    display:flex;
    flex-direction:column;
`
const Title = styled.span`
    margin:3px 0 7px 0;
    font-size:16px;
    font-weight:700;
`
const LikeCount = styled.span`
    font-size:12px;
    color:${props => props.theme.themeGray};
`

const DisplayItem = ({ id, title, user, itemPhotos, isMine, likeCount, isLiked }) => {

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
                {!isMine ? (
                    <ToggleLike itemId={id} isLiked={isLiked} />
                ) : null}
                <LikeCount>관심 : {likeCount}</LikeCount>
            </MetaData>
        </Container >
    )
}

DisplayItem.propTypes = {
    id: propTypes.number.isRequired,
    title: propTypes.string.isRequired,
    user: propTypes.shape({
        id: propTypes.number.isRequired,
        name: propTypes.string.isRequired,
        location: propTypes.string.isRequired,
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