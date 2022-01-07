import { gql } from '@apollo/client';


export const ITEM_DEFAULT_FRAGMENT = gql`
    fragment ItemDefaultFragment on Item{
        id
        title
        user{
            id
            name
            username
            avatar
            isMe
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