/* 
작성자 : SJ
작성일 : 2022.01.18
수정일 : ------
*/

// DisplayItem에서 사용할 ToggleLike Mutation Component

import { gql, useMutation, useReactiveVar } from '@apollo/client'
import useLoggedInUser from '../../../hooks/useLoggedInUser'
import FontAwesomeBtn from '../../shared/buttons/FontAwesomeBtn'
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { darkModeVar } from '../../../utils/apollo';
import { colors } from '../../../utils/styles';

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ok
            error
        }
    }
`

export default function ToggleLike({ itemId, isLiked }) {
    const { loggedInUser } = useLoggedInUser()
    const darkMode = useReactiveVar(darkModeVar)

    // 관심 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok } } = data
        if (ok) {
            const photoPressedLike = cache.readFragment({
                id: `Item:${itemId}`,
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
                `
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
                        return isLiked ? prev : [photoPressedLike, ...prev]
                    }
                }
            })
            cache.modify({
                id: `Item:${itemId}`,
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
            id: itemId
        },
        update: updateToggleLike
    })
    return (
        <FontAwesomeBtn
            onClick={toggleLike}
            checkState={isLiked}
            icon={isLiked ? solidHeart : faHeart}
            size={"lg"}
            color={isLiked ? colors.pink : darkMode ? colors.white : colors.black}
        />
    )
}