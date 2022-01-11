/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : 2022.01.10
*/
// 클릭한 아이템의 상세정보를 보여주는 페이지

import { useParams } from "react-router-dom"
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client"
import { ITEM_DEFAULT_FRAGMENT } from '../../components/shared/fragments'
import MainLayout from '../../components/main/MainLayout'
import styled from 'styled-components'
import UserAvatar from '../../components/main/UserAvatar'
import Username from '../../components/main/Username'
import UserLocation from '../../components/main/UserLocation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { colors } from '../../utils/styles'
import { darkModeVar } from '../../utils/apollo'
import { useState } from 'react'
import Button from '../../components/shared/Button'
import { Link } from "react-router-dom"
import DropDownMenu from '../../components/main/DropDownMenu'
import PhotoSlider from '../../components/main/PhotoSlider'
import ItemPhoto from '../../components/main/ItemPhoto'
import UserData from '../../components/main/UserData'

const Container = styled.div`
    display:flex;
    flex-direction:column;
    flex:1;
    justify-content:center;
    border:${props => props.theme.themeGray} 1px solid;
    border-radius:20px;
    margin : 0 auto;
    margin-top:30px;
    max-width:700px;
    margin-bottom:30px;
`
const Header = styled.header`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:20px;
    justify-content:space-between;
`
const Title = styled.h4`
    font-size:24px;
    font-weight:700;
    margin-bottom:10px;
`

const MetaData = styled.div`
    padding:20px;
    width:100%;
`

const Buttons = styled.div`
    display:flex;
    justify-content:space-between;
`
const LikeData = styled.div`
    display:flex;
    align-items:center;
`
const LikeBtn = styled.button`
    
`
const LikeCount = styled.span`
    font-size:14px;
    color:${props => props.theme.themeGray};
`

const Description = styled.p`
    margin:20px 0px 10px 0;
    font-size:14px;
    // 콘텐츠가 다음 줄로 넘어가고 필요한 경우 단어 줄 바꿈이 발생한다.
    word-wrap: break-word;
`

const TOGGLE_LIKE_MUTATION = gql`
    mutation toggleLike($id:Int!){
        toggleLike(id:$id){
            ok
            error
        }
    }
`


export const SEE_ITEM = gql`
    query seeItem($id:Int!){
        seeItem(id:$id){
            ...ItemDefaultFragment
            description
            likes{
                id
                username
                avatar
            }
        }
    }
    ${ITEM_DEFAULT_FRAGMENT}
`

export default function ItemDetail() {
    const darkMode = useReactiveVar(darkModeVar)
    const [itemData, setItemData] = useState({})

    // 파라미터에서 id를 뽑아 resolver의 variables로 줄 것이다.
    const { id } = useParams()

    const { loading } = useQuery(SEE_ITEM, {
        variables: {
            id: parseInt(id)
        },
        onCompleted: ({ seeItem }) => setItemData(seeItem)
    })

    // 좋아요 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok } } = data
        const result = cache.readFragment({
            id: `Item:${id}`,
            fragment: gql`
                fragment isLiked on Item{
                    isLiked
                }
            `
        })
        const { isLiked: cacheIsLiked } = result
        if (ok) {
            cache.modify({
                id: `Item:${id}`,
                fields: {
                    isLiked(prev) {
                        return !prev
                    },
                    likeCount(prev) {
                        return cacheIsLiked ? prev - 1 : prev + 1
                    }
                }
            })
        }
    }
    const [toggleLike] = useMutation(TOGGLE_LIKE_MUTATION, {
        variables: {
            id: parseInt(id)
        },
        update: updateToggleLike
    })

    return (
        <MainLayout title={itemData?.title} loading={loading}>
            <Container>
                <Header>
                    <Link to={`/user/${itemData?.user?.id}`}>
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
                            <LikeData>
                                <LikeBtn onClick={toggleLike} isLiked={itemData?.isLiked}>
                                    <FontAwesomeIcon
                                        icon={itemData?.isLiked ? solidHeart : faHeart}
                                        size="2x"
                                        color={itemData?.isLiked ? colors.pink : darkMode ? colors.white : colors.black}
                                    />
                                </LikeBtn>
                            </LikeData>
                            <Button text="실시간 채팅" onClick={() => null} />
                        </Buttons>
                    ) : null}
                    <LikeCount>{itemData?.likeCount} 개의 관심</LikeCount>
                    <Description>
                        {itemData?.description}
                    </Description>
                </MetaData>
            </Container>
        </MainLayout>
    )
}