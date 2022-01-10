/* 
작성자 : SJ
작성일 : 2022.01.08
수정일 : 2022.01.10
*/
// FormLayout과 MainLayout의 부모 Component(상속해서 쓸 예정)

import styled from 'styled-components';

const BaseContainer = styled.div`
    display:flex;
    flex-direction:column;
    max-width:1200px;
    margin:0 auto;
    height:100vh;
`
export default BaseContainer;