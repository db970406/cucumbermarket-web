/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.14
*/

// ApolloClient 관련파일

import { ApolloClient, InMemoryCache, makeVar, split } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getMainDefinition, offsetLimitPagination } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws';

/* 
로그인 구현부
로그인 후 주어지는 token을 localStorage에 저장하여 로그인 유지 및 인가에 사용한다.
*/
const TOKEN = "Token"
export const isLoggedInVar = makeVar(Boolean(localStorage.getItem(TOKEN)))
export const logUserIn = (token) => {
    isLoggedInVar(true)
    localStorage.setItem(TOKEN, token)
    window.location.href = "/"
}
export const logUserOut = (history) => {
    window.location.reload()
    isLoggedInVar(false)
    localStorage.removeItem(TOKEN)
    history.replace()
    window.location.href = "/"
}


/* 
다크모드 구현부
새로고침해도 다크모드가 해제되지 않게 localStorage에 값 저장
*/
const DARKMODE = "Darkmode"
export const darkModeVar = makeVar(Boolean(localStorage.getItem(DARKMODE)))
export const getDarkMode = () => {
    darkModeVar(true)
    localStorage.setItem(DARKMODE, "enabled")
}
export const getLightMode = () => {
    darkModeVar(false)
    localStorage.removeItem(DARKMODE)
}

export const chatRoomIdVar = makeVar(0)
export const chatUserIdVar = makeVar(0)
export const showChatListVar = makeVar(false)


const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: localStorage.getItem(TOKEN)
        }
    }
})
const uploadHttpLink = createUploadLink({
    uri: "http://localhost:4000/graphql",
})

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:4000/graphql',
    options: {
        reconnect: true,
        connectionParams: () => ({
            token: localStorage.getItem(TOKEN)
        })
    }
});
const httpLinks = authLink.concat(uploadHttpLink)

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
})
