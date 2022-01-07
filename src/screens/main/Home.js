/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import DisplayItem from '../../components/main/home/DisplayItem';
import MainLayout from '../../components/main/MainLayout';

const SEE_ITEMS = gql`
    query seeItems{
        seeItems{
            id
            title
            description
            user{
                id
                name
                username
                avatar
                isMe
            }
            itemPhotos{
                id
                file
            }
            isMine
            likes{
                id
                username
                avatar
            }
            likeCount
            isLiked
        }
    }
`

const Grid = styled.div`
    display:flex;
    flex-direction:row;
    gap:40px;
`
export default function Home() {
    const { data, loading } = useQuery(SEE_ITEMS)
    return (
        <MainLayout title="오이마켓" loading={loading}>
            <Grid>
                {data?.seeItems?.map(item =>
                    <DisplayItem
                        key={item.id}
                        {...item}
                    />
                )}
            </Grid>
        </MainLayout>
    )
}