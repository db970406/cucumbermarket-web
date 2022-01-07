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
`
const ItemPhoto = styled.img`
    width:100%;
    max-height:500px;
`
const MetaData = styled.div`
    padding:10px;
    width:100%;
`

const Actions = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
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
const ChatBtn = styled.button`
    background-color:${colors.green};
    padding:10px;
    border-radius:7px;
    span{
        color:${colors.white};
    }
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

    // 파라미터에서 id를 뽑아 resolver의 variables로 줄 것이다.
    const { id } = useParams()

    const { data, loading } = useQuery(SEE_ITEM, {
        variables: {
            id: parseInt(id)
        }
    })

    // 좋아요 Mutation과 프론트 즉각 반영을 위한 cache작업
    const updateToggleLike = (cache, { data }) => {
        const { toggleLike: { ok, error } } = data
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
        autoplay: true
    };
    return (
        <MainLayout title={data?.seeItem?.title} loading={loading}>
            <Container>
                <Header>
                    <Title>{data?.seeItem?.title}</Title>
                    <UserData>
                        <UserAvatar img={data?.seeItem?.user?.avatar} size={40} />
                        <UserInfo>
                            <Username name={data?.seeItem?.user?.name} size={20} />
                            <UserLocation location={data?.seeItem?.user?.location} size={16} />
                        </UserInfo>
                    </UserData>
                </Header>
                <PhotoCase>
                    <Slider {...settings}>
                        {data?.seeItem?.itemPhotos?.map(itemPhoto =>
                            <ItemPhoto
                                key={itemPhoto.id}
                                src={itemPhoto.file}
                                alt={data?.seeItem?.title}
                            />
                        )}
                    </Slider>
                </PhotoCase>
                <MetaData>
                    {!data?.seeItem?.isMine ? (
                        <Actions>
                            <LikeData>
                                <LikeBtn onClick={toggleLike} isLiked={data?.seeItem?.isLiked}>
                                    <FontAwesomeIcon
                                        icon={data?.seeItem?.isLiked ? solidHeart : faHeart}
                                        size="2x"
                                        color={data?.seeItem?.isLiked ? colors.pink : darkMode ? colors.white : colors.black}
                                    />
                                </LikeBtn>
                                <LikeCount>{data?.seeItem?.likeCount} 개의 관심</LikeCount>
                            </LikeData>
                            <ChatBtn>
                                <span>실시간 채팅</span>
                            </ChatBtn>
                        </Actions>
                    ) : null}
                    <Description>
                        {data?.seeItem?.description}
                    </Description>
                </MetaData>
            </Container>
        </MainLayout>
    )
}