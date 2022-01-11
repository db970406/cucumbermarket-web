/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.11
*/

import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';
import DisplayItem from '../../components/main/DisplayItem';
import MainLayout from '../../components/main/MainLayout';
import { ITEM_DISPLAY_FRAGMENT } from '../../components/shared/fragments';

const SEE_ITEMS = gql`
    query seeItems{
        seeItems{
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`

const Container = styled.div`
    flex:1;
    display:flex;
    justify-content:center;
    margin:0 auto;
`

// Main에 display될 item들의 배치
const Flex = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:center;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
`
export default function Home() {
    const [itemsData, setItemsData] = useState([])

    const { loading } = useQuery(SEE_ITEMS, {
        onCompleted: ({ seeItems }) => setItemsData(seeItems)
    })
    return (
        <MainLayout title="오이마켓" loading={loading || itemsData.length === 0}>
            <Container>
                <Flex>
                    {itemsData?.map(item =>
                        <DisplayItem
                            key={item.id}
                            {...item}
                        />
                    )}
                </Flex>
            </Container>
        </MainLayout>
    )
}