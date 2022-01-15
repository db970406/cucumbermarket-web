/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.14
*/

// 메인 Screen

import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';
import DisplayItem from '../../components/main/items/DisplayItem';
import MainLayout from '../../components/layouts/MainLayout';
import { ITEM_DISPLAY_FRAGMENT } from '../../components/shared/utils/fragments';
import { searchDataVar } from '../../utils/apollo';

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
    const searchData = useReactiveVar(searchDataVar)

    const { loading } = useQuery(SEE_ITEMS, {
        onCompleted: ({ seeItems }) => setItemsData(seeItems)
    })

    return (
        <MainLayout title="오이마켓" loading={loading || itemsData?.length === 0}>
            <Container>
                <Flex>
                    {searchData?.length > 0 ? (
                        searchData?.map(item =>
                            <DisplayItem
                                key={item.id}
                                {...item}
                            />
                        )
                    ) : (
                        itemsData?.map(item =>
                            <DisplayItem
                                key={item.id}
                                {...item}
                            />
                        )
                    )}
                </Flex>
            </Container>
        </MainLayout>
    )
}