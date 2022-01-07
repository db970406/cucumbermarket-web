/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
*/

import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import propTypes from 'prop-types'
import styled from 'styled-components';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';
import UserAvatar from '../UserAvatar';
import Username from '../Username';

const Container = styled.div`

`
const PhotoCase = styled.div`
    max-width:200px;
    height:200px;
    img{
        margin:0 auto;
        width:100%;
        height:100%;
        border-radius:7px;
    }
`
const ItemPhoto = styled.img`

`
const MetaData = styled.div`
    padding:7px;
    display:flex;
    flex-direction:column;
`
const Title = styled.span`
    margin:7px 0;
    font-size:14px;
    font-weight:600;
`
const UserData = styled.div`
    display:flex;
    align-items:center;
`
const LikeData = styled.div`
    margin-top:5px;
`
const LikeBtn = styled.button`
`
const LikeCount = styled.span``

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ok
            error
        }
    }
`

const DisplayItem = ({ id, title, description, user, itemPhotos, isMine, likes, likeCount, isLiked }) => {
    const darkMode = useReactiveVar(darkModeVar)

    // 좋아요 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok, error } } = data
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
            <PhotoCase>
                <ItemPhoto src={itemPhotos[0].file} />
            </PhotoCase>
            <MetaData>
                <Title>{title}</Title>
                <UserData>
                    <UserAvatar img={user.avatar} size={25} />
                    <Username name={user.name} size={18} />
                </UserData>
                <LikeData>
                    <LikeBtn onClick={toggleLike} isLiked={isLiked}>
                        <FontAwesomeIcon
                            icon={isLiked ? solidHeart : faHeart}
                            size="lg"
                            color={isLiked ? colors.pink : darkMode ? colors.white : colors.black}
                        />
                    </LikeBtn>
                    <LikeCount>관심 : {likeCount}</LikeCount>
                </LikeData>
            </MetaData>
        </Container>
    )
}

DisplayItem.propTypes = {
    id: propTypes.number.isRequired,
    title: propTypes.string.isRequired,
    description: propTypes.string.isRequired,
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
    likes: propTypes.arrayOf(propTypes.shape({
        id: propTypes.number.isRequired,
        username: propTypes.string.isRequired,
        avatar: propTypes.string,
    })),
    isMine: propTypes.bool.isRequired,
    likeCount: propTypes.number.isRequired,
    isLiked: propTypes.bool.isRequired,
};

export default DisplayItem