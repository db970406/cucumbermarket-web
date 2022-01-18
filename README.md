# Cucumber Market - Backend
- 2022.01.04 ~ 2022.01.17
- [데모]

## 1. 개발 목표
### 1) 기술 숙달
- React의 Component 개발 방식 및 함수형 Component에서의 주요 Hooks 숙달
- ApolloClient가 제공하는 Reactive Variable로 상태관리
- 직접 만든 프로젝트에서 프론트엔드에서 백엔드와의 API 소통을 이해
- 소셜 로그인, 위치 제공 등 유명 기업의 공유 API 사용법 숙달
### 2) 웹의 흐름 이해
- 프론트엔드 <-> 백엔드의 흐름 이해 및 현재 보유한 지식의 실무 활용을 위해 총동원하여 풀스택 프로젝트 개발


## 2. 사용 기술
- React
- styled-components(CSS-in-JS 라이브러리)
- Apollo Client(GraphQL)
- FontAwesome

## 3. Rest API가 아닌 GraphQL을 택한 이유
 1) Under-fetching의 문제
- 현 프로젝트는 Room이 Message를 필드로 가지고 또 그 Message는 User를 필드로 가지는 등 데이터가 얽혀있는 구조이다
- 예시로 Room에 속한 Messages들의 주인인 User들을 가져올 때 Rest API를 사용하면 언더페칭의 문제가 많이 생길 것 같았다.
 2) Over-fetching의 문제
- 예시로 seeRooms에서 Room들의 데이터를 요청하게 되는데 이 때 Room에 속한 User정보만 필요하지 Message정보는 필요하지 않으므로 필요없는 데이터까지 과도하게 가져오는 것을 우려했다.
- 즉 오버페칭을 방지하기 위해서 GraphQL을 써야겠다고 생각했고 그 중 가장 유명한 툴인 Apollo를 서버로 택했다.



