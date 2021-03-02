import React, { Component } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import { connect } from 'react-redux'
import jwt_decode from "jwt-decode";

import AuthPage from "./views/Auth";
import MatchesPage from "./views/Matches";
import ListPage from "./views/List";
import MessagesPage from "./views/Messages";
import ProfilePage from "./views/Profile";
import EditProfilePage from "./views/EditProfile";
import SignUp from "./components/Signup/Signup";
import MainNavigation from "./components/Navigation/MainNavigation";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import Followers from "./components/Followers/Followers";
import Following from "./components/Following/Following";
import Messages from "./components/Messages/Messages";
import Photos from "./components/Photos/Photos";
import * as actions from './store/actions/index';

import "./App.css";

class App extends Component {

  componentDidMount() {
    // axios.defaults.headers.common["Content-Type"] = "application/json";
    this.props.onCheckAuthState();
  }

  render() {
    return (
      <React.Fragment>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {!this.props.isAuthenticated && <Redirect exact from="/" to="/auth" />}
            {this.props.isAuthenticated && <Redirect exact from="/" to="/matches" />}
            <Route
              exact
              path="/auth"
              component={(props) => (
                <AuthPage
                  {...props}
                />
              )}
            />
            <Route exact path="/list" component={ListPage} />
            <Route exact path="/signup" component={SignUp} />
            <PrivateRoute exact path="/matches" component={MatchesPage} />
            <PrivateRoute exact path="/messages" component={MessagesPage} />
            <PrivateRoute
              path="/myprofile"
              component={(props) => {
                return (
                  <div>
                    <EditProfilePage {...props}>
                      <Switch>
                        <Route
                          path={`${props.path}/followers`}
                          component={Followers}
                        />
                        <Route
                          path={`${props.path}/following`}
                          component={Following}
                        />
                        <Route
                          path={`${props.path}/photos`}
                          component={(props) => <Photos {...props} />}
                        />
                        <Route
                          path={`${props.path}/messages`}
                          component={Messages}
                        />
                      </Switch>
                    </EditProfilePage>
                  </div>
                )
              }}
            />
            <PrivateRoute
              path="/profile/:id"
              component={(props) => {
                return (
                  <div>
                    <ProfilePage {...props}>
                      <Switch>
                        <Route
                          path={`${props.path}/followers`}
                          component={Followers}
                        />
                        <Route
                          path={`${props.path}/following`}
                          component={Following}
                        />
                        <Route
                          path={`${props.path}/photos`}
                          component={(props) => <Photos {...props} />}
                        />
                        <Route
                          path={`${props.path}/messages`}
                          component={Messages}
                        />
                      </Switch>
                    </ProfilePage>
                  </div>
                )
              }}
            />

          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetUserToken: (decodedToken) => dispatch(actions.setCurrentUser(decodedToken)),
    onCheckAuthState: () => dispatch(actions.checkAuthState)
  }
}

const routedApp = withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
export default routedApp;