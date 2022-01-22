/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.19
*/

import styled from 'styled-components';

const Count = styled.p`
    color:${({ theme }) => theme.themeGray};
`;

export default function LikeCount({ likeCount, size }) {
    return (
        <Count
            style={{
                fontSize: size,
                paddingBlock: 10
            }}
        >
            {likeCount}
        </Count>
    )
}