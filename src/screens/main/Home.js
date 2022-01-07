/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.07
*/

import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import DisplayItem from '../../components/main/home/DisplayItem';
import MainLayout from '../../components/main/MainLayout';
import { ITEM_DEFAULT_FRAGMENT } from '../../components/shared/fragments';

const SEE_ITEMS = gql`
    query seeItems{
        seeItems{
            ...ItemDefaultFragment
        }
    }
    ${ITEM_DEFAULT_FRAGMENT}
`

// Main에 display될 item들의 배치
const Flex = styled.div`
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    gap:40px;
    margin:0 auto;
`
export default function Home() {
    const { data, loading } = useQuery(SEE_ITEMS)
    return (
        <MainLayout title="오이마켓" loading={loading}>
            <Flex>
                {data?.seeItems?.map(item =>
                    <DisplayItem
                        key={item.id}
                        {...item}
                    />
                )}
            </Flex>
        </MainLayout>
    )
}