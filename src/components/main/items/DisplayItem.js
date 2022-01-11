/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.11
*/

import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn';
import UserData from '../users/UserData';

const Container = styled.div`
    transition:all 0.2s ease-in-out;
    &:hover{
        transform:scale(1.05);
    }
`
const PhotoCase = styled.div`
    width:200px;
    height:200px;
    img{
        border-radius:7px;
    }
`
const ItemPhoto = styled.img`
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

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ok
            error
        }
    }
`

const DisplayItem = ({ id, title, user, itemPhotos, isMine, likeCount, isLiked }) => {
    const darkMode = useReactiveVar(darkModeVar)

    // 좋아요 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok } } = data
        if (ok) {
            cache.modify({
                id: `Item:${id}`,
                fields: {
                    isLiked(prev) {
                        return !prev
                    },
                    likeCount(prev) {
                        return isLiked ? prev - 1 : prev + 1
                    }
                }
            })
        }
    }
    const [toggleLike] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id
        },
        update: updateToggleLike
    })
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
                    <Link to={`/user/${user.id}`}>
                        <UserData
                            avatar={user.avatar}
                            name={user.name}
                            location={user.location}
                            avatarSize={30}
                            nameSize={14}
                            locationSize={12}
                        />
                    </Link>
                ) : null}
                {!isMine ? (
                    <FontAwesomeBtn
                        onClick={toggleLike}
                        checkState={isLiked}
                        icon={isLiked ? solidHeart : faHeart}
                        size={"lg"}
                        color={isLiked ? colors.pink : darkMode ? colors.white : colors.black}
                    />
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
        username: propTypes.string.isRequired,
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