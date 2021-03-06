/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.19
*/

/*
1. 메인 Screen(seeItems Query)
2. Reactive Variable을 활용하여 search한 값이 있다면 그 값을, 없다면 seeItems값을 띄운다.
*/

import { gql, useQuery, useReactiveVar } from '@apollo/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DisplayItem from '../../../components/main/items/DisplayItem';
import MainLayout from '../../../components/layouts/MainLayout';
import { ITEM_DISPLAY_FRAGMENT } from '../../../components/shared/utils/fragments';
import { searchDataVar } from '../../../utils/apollo';

const SEE_ITEMS = gql`
    query seeItems{
        seeItems{
            ...ItemDisplayFragment
        }
    }
    ${ITEM_DISPLAY_FRAGMENT}
`;

const Container = styled.div`
    flex:1;
    display:flex;
    justify-content:center;
    margin:0 auto;
`;

// Main에 display될 item들의 배치
const Flex = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:center;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
`;

export default function Home() {
    const [itemsData, setItemsData] = useState([]);
    const searchData = useReactiveVar(searchDataVar);

    const { data, loading } = useQuery(SEE_ITEMS);

    useEffect(() => {
        if (data?.seeItems) {
            setItemsData(data?.seeItems);
        }
    }, [data]);
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
    );
};