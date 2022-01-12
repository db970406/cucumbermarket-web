/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.12
*/

import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DisplayItem from '../../components/main/items/DisplayItem';
import MainLayout from '../../components/layouts/MainLayout';
import { ITEM_DISPLAY_FRAGMENT } from '../../components/shared/utils/fragments';
import { useLocation } from 'react-router-dom';

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
const SearchAlarm = styled.p`
    font-size:14px;
    margin-bottom:30px;
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
    const { state } = useLocation()
    const [itemsData, setItemsData] = useState([])
    const [searchData, setSearchData] = useState([])

    const { loading } = useQuery(SEE_ITEMS, {
        onCompleted: ({ seeItems }) => setItemsData(seeItems)
    })

    useEffect(() => {
        setSearchData(state?.searchItems)
    }, [state])
    return (
        <MainLayout title="오이마켓" loading={loading || itemsData?.length === 0}>
            {searchData?.length > 0 ? <SearchAlarm>검색 결과입니다.</SearchAlarm> : null}
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