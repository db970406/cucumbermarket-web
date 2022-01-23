/* 
작성자 : SJ
작성일 : 2022.01.23
수정일 : ------
*/

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from './screens/main/users/Login';
import Home from './screens/main/items/Home';
import CreateUser from './screens/main/users/CreateUser';
import SeeUser from './screens/main/users/SeeUser';
import GetTokenFromUrl from './utils/GetTokenFromUrl';
import EditUser from './screens/main/users/EditUser';
import EditItem from './screens/main/items/EditItem';
import UploadItem from './screens/main/items/UploadItem';
import DeleteItem from './screens/main/items/DeleteItem';
import SeeItem from './screens/main/items/SeeItem';
import NotFound from './components/shared/utils/NotFound';
import { isLoggedInVar } from './utils/apollo';
import { useReactiveVar } from '@apollo/client';

export default function Router() {
    const isLoggedIn = useReactiveVar(isLoggedInVar);

    return (
        <BrowserRouter>
            {isLoggedIn ? (
                <Switch>
                    <Route path="/" exact>
                        <Home />
                    </Route>
                    <Route path="/item/upload" exact>
                        <UploadItem />
                    </Route>
                    <Route path="/item/:id" exact>
                        <SeeItem />
                    </Route>
                    <Route path="/item/:id/edit" exact>
                        <EditItem />
                    </Route>
                    <Route path="/item/:id/delete" exact>
                        <DeleteItem />
                    </Route>

                    <Route path="/user/:id">
                        <SeeUser />
                    </Route>
                    <Route path="/user/:id/edit" exact>
                        <EditUser />
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
                        <CreateUser />
                    </Route>
                    <Route path="/:social" exact>
                        <GetTokenFromUrl />
                    </Route>

                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            )}
        </BrowserRouter>
    )
}