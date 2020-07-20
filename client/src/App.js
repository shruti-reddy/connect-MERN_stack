import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import jwt from "jsonwebtoken";
import AuthPage from "./views/Auth";
import MatchesPage from "./views/Matches";
import ListPage from "./views/List";
import MessagesPage from "./views/Messages";
import ProfilePage from "./views/Profile";
import EditProfilePage from "./views/EditProfile";
import SignUp from "./components/Signup/Signup";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
    userName: null,
    userPhoto: null,
  };

  login = (token) => {
    const decodedToken = jwt.decode(token);

    this.setState({
      token,
      userId: decodedToken.userId,
      userName: decodedToken.userName,
      userPhoto: decodedToken.userPhoto,
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null,
      userName: null,
      userPhoto: null,
    });
    localStorage.removeItem("token");
    //this.props.history.push("/auth");
  };

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("token"));

    if (token) {
      this.login(token);
    }
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              userName: this.state.userName,
              userPhoto: this.state.userPhoto,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Redirect from="/" to="/auth" exact />
                <Route path="/auth" component={AuthPage} />
                <Route path="/matches" component={MatchesPage} />
                <Route path="/list" component={ListPage} />
                <Route path="/signup" component={SignUp} />
                <Route path="/messages" component={MessagesPage} />
                <Route path="/profile/:id" component={ProfilePage} />
                <Route path="/edit-profile" component={EditProfilePage} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
