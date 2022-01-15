/* 
작성자 : SJ
작성일 : 2022.01.06
수정일 : 2022.01.13
*/


import { ApolloProvider, useReactiveVar } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { ThemeProvider } from 'styled-components';
import Login from './screens/main/users/Login';
import Home from './screens/main/items/Home';
import { client, darkModeVar, isLoggedInVar } from './utils/apollo';
import { darkTheme, GlobalStyles, lightTheme } from './utils/styles';
import SignUp from './screens/main/users/CreateUser';
import UserDetail from './screens/main/users/SeeUser';
import GetTokenFromUrl from './utils/GetTokenFromUrl';
import UserEdit from './screens/main/users/EditUser';
import ItemEdit from './screens/main/items/EditItem';
import ItemUpload from './screens/main/items/UploadItem';
import ItemDelete from './screens/main/items/DeleteItem';
import ItemDetail from './screens/main/items/SeeItem';
import NotFound from './components/shared/utils/NotFound';

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  const darkMode = useReactiveVar(darkModeVar)

  return (
    <HelmetProvider>
      <ApolloProvider client={client}>
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
          <GlobalStyles />
          <Router>
            {isLoggedIn ? (
              <Switch>
                <Route path="/" exact>
                  <Home />
                </Route>
                <Route path="/item/upload" exact>
                  <ItemUpload />
                </Route>
                <Route path="/item/:id" exact>
                  <ItemDetail />
                </Route>
                <Route path="/item/:id/edit" exact>
                  <ItemEdit />
                </Route>
                <Route path="/item/:id/delete" exact>
                  <ItemDelete />
                </Route>

                <Route path="/user/:id" exact>
                  <UserDetail />
                </Route>
                <Route path="/user/:id/edit" exact>
                  <UserEdit />
                </Route>

                <Route>
                  <NotFound />
                </Route>
              </Switch>
            ) : (
              <Switch>
                <Route path="/" exact>
                  <Login />
                </Route>
                <Route path="/sign-up" exact>
                  <SignUp />
                </Route>
                <Route path="/:social">
                  <GetTokenFromUrl />
                </Route>

                <Route>
                  <NotFound />
                </Route>
              </Switch>
            )}
          </Router>
        </ThemeProvider>
      </ApolloProvider>
    </HelmetProvider>
  );
}

export default App;
