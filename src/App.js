/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : ------
*/

import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ThemeProvider } from 'styled-components';
import Login from './screens/auth/Login';
import Home from './screens/main/Home';
import NotFound from './components/shared/NotFound';
import { client, darkModeVar, isLoggedInVar } from './utils/apollo';
import { darkTheme, GlobalStyles, lightTheme } from './utils/styles';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  const darkMode = useReactiveVar(darkModeVar)

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <HelmetProvider>
          <GlobalStyles />
          <Router>
            <Switch>
              <Route path="/" exact>
                {isLoggedIn ? <Home /> : <Login />}
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Router>
        </HelmetProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
