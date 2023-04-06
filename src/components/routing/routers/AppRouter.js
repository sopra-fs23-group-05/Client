import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import AdminLogin from "../../views/AdminLogin";
import UserLogin from "../../views/UserLogin";
import LobbyPage from "../../views/LobbyPage";
import Homepage from "components/views/Homepage";
import Rules from "components/views/Rules";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
          <BrowserRouter>
              <Switch>
                  <Route exact path="/homepage">
                      <Homepage/>
                  </Route>
                  <Route exact path="/rules">
                      <Rules/>
                  </Route>
                  <Route exact path="/">
                      <Redirect to="/homepage"/>
                  </Route>
                  <Route exact path="/admin-login">
                      <AdminLogin/>
                  </Route>
                  <Route exact path="/user-login">
                      <UserLogin/>
                  </Route>
                  <Route exact path="/lobbies/:accessCode">
                      <LobbyPage/>
                  </Route>
              </Switch>
          </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
