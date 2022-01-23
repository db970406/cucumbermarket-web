/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.23
*/

import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import Router from './Router';
import { client, darkModeVar } from './utils/apollo';
import { darkTheme, GlobalStyles, lightTheme } from './utils/styles';

function App() {
  const darkMode = useReactiveVar(darkModeVar);

  return (
    <HelmetProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router />
        </ThemeProvider>
      </ApolloProvider>
    </HelmetProvider>
  );
};

export default App;
