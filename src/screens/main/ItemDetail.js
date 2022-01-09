/* 
작성자 : SJ
작성일 : 2022.01.07
수정일 : ------
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
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from 'react'
import Button from '../../components/shared/Button'
import { Link } from "react-router-dom"

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
`
const Header = styled.header`
    display:flex;
    flex-direction:row;
    align-items:center;
    padding:20px;
    justify-content:space-between;
`
const Title = styled.span`
    font-size:24px;
    font-weight:700;
`

const UserData = styled.div`
    display:flex;
    align-items:center;
`
const UserInfo = styled.div`
    display:flex;
    flex-direction:column;
`

const PhotoCase = styled.div`
    width:100%;
    .slick-dots li button:before{
        opacity: .25;
        color: ${colors.green};
    }
    .slick-dots li.slick-active button:before{
        opacity: .75;
        color: ${colors.green};
    }

`
const ItemPhoto = styled.img`
    width:100%;
    max-height:500px;
`
const MetaData = styled.div`
    padding:10px;
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
    margin-left:5px;
`

const Description = styled.p`
    margin:10px;
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


const SEE_ITEM = gql`
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

    // itemPhotos 슬라이더로 자동 재생되게 설정하였음
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        dots: true,
    };
    return (
        <MainLayout title={itemData?.title} loading={loading}>
            <Container>
                <Header>
                    <Title>{itemData?.title}</Title>
                    <Link to={`/user/${itemData?.user?.id}`}>
                        <UserData>
                            <UserAvatar img={itemData?.user?.avatar} size={40} />
                            <UserInfo>
                                <Username name={itemData?.user?.name} size={20} />
                                <UserLocation location={itemData?.user?.location} size={16} />
                            </UserInfo>
                        </UserData>
                    </Link>
                </Header>
                <PhotoCase>
                    <Slider {...settings}>
                        {itemData?.itemPhotos?.map(itemPhoto =>
                            <ItemPhoto
                                key={itemPhoto.id}
                                src={itemPhoto.file}
                                alt={itemData?.title}
                            />
                        )}
                    </Slider>
                </PhotoCase>
                <MetaData>
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
                                <LikeCount>{itemData?.likeCount} 개의 관심</LikeCount>
                            </LikeData>
                            <Button text="실시간 채팅" onClick={() => null} />
                        </Buttons>
                    ) : null}
                    <Description>
                        {itemData?.description}
                    </Description>
                </MetaData>
            </Container>
        </MainLayout>
    )
}