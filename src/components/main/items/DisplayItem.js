/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.12
*/

import { gql, useMutation, useReactiveVar } from '@apollo/client';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import propTypes from 'prop-types'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useLoggedInUser from '../../../hooks/useLoggedInUser';
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
    const { loggedInUser } = useLoggedInUser()

    // 좋아요 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok } } = data
        if (ok) {
            const photoPressedLike = cache.writeFragment({
                id: `Item:${id}`,
                fragment: gql`
                    fragment itemDisplay on Item{
                        id
                        title
                        user{
                            id
                            name
                            avatar
                            location
                        }
                        itemPhotos{
                            id
                            file
                        }
                        isMine
                        likeCount
                        isLiked
                    }
                `,
                data: {
                    id,
                    title,
                    user,
                    itemPhotos,
                    isMine,
                    likeCount,
                    isLiked
                }
            })

            cache.modify({
                id: `User:${loggedInUser?.id}`,
                fields: {
                    likeCount(prev) {
                        return isLiked ? prev - 1 : prev + 1
                    },
                    likes(prev) {
                        /*
                        관심을 누른 상태라면 존재하는 likes 배열에서 write한 fragment와 같은 값을 배열에서 제거한다.
                        const clearMyLikes = prev.filter(item => item.__ref !== photoPressedLike.__ref)

                        관심을 누르지 않았다면 write한 fragment를 likes 배열에 추가한다.
                        return isLiked ? clearMyLikes : [photoPressedLike, ...prev]
                        */

                        // 유저 사용성을 고려했을 때 관심 해제 시 UserDetail에서 해당 Item을 바로 사라지게 하는 것보단 Item은 두되 관심만 해제시키는게 나은 듯?
                        return prev
                    }
                }
            })
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