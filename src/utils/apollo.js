/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.26
*/

// ApolloClient 관련파일

import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws';


//Message 관련 Reactive Variables
export const chatRoomIdVar = makeVar(0);
export const chatUserIdVar = makeVar(0);
export const showChatListVar = makeVar(false);
export const searchDataVar = makeVar([]);

//Item 관련 Reactive Variables
export const searchModeVar = makeVar(false);

//위치 관련 Reactive Variables
export const currentLocationVar = makeVar("");

/* 
로그인 구현부
로그인 후 주어지는 token을 localStorage에 저장하여 로그인 유지 및 인가에 사용한다.
*/
const TOKEN = "Token"
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)));
export const logUserIn = (token) => {
    isLoggedInVar(true);
    localStorage.setItem(TOKEN, token);
    window.location.href = "/"
};
export const logUserOut = (history) => {
    isLoggedInVar(false);
    localStorage.removeItem(TOKEN);
    history.replace();
    history.push("/")
};


/* 
다크모드 구현부
새로고침해도 다크모드가 해제되지 않게 localStorage에 값 저장
*/
const DARKMODE = "Darkmode";
export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARKMODE)));
export const getDarkMode = () => {
    darkModeVar(true);
    localStorage.setItem(DARKMODE, "enabled");
};

export const getLightMode = () => {
    darkModeVar(false);
    localStorage.removeItem(DARKMODE);
};


// 서버의 Header에 localStorage에 저장한 jwtToken을 싣어보내기 위한 link
const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: localStorage.getItem(TOKEN)
        }
    };
});

// 파일을 서버에 업로드하기 위한 link
const uploadHttpLink = createUploadLink({
    uri: "http://localhost:4000/graphql",
});

// 웹소켓 프로토콜 link로 jwtToken을 싣어보내기 위함
const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true,
        connectionParams: () => ({
            token: localStorage.getItem(TOKEN)
        })
    }
});

const httpLinks = authLink.concat(uploadHttpLink);

// operation이 subscription이라면 wsLink를, 아니라면 httpLinks를 연결하는 함수
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLinks,
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        typePolicies: {
            Room: {
                fields: {
                    messages: offsetLimitPagination()
                }
            }
        }
    })
});
