import React, { Component } from "react";
import { NavLink, Route, withRouter } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import "./MainNavigation.css";

class MainNavigation extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => {
          return (
            <header className="main-navigation">
              <div className="main-navigation__logo">
                <h1>Connect</h1>
              </div>
              <div className="main-navigation__items">
                {context.token && (
                  <ul>
                    <li>
                      <NavLink to="/list">List</NavLink>
                    </li>
                    <li>
                      <NavLink to="/matches">Matches</NavLink>
                    </li>
                    <li>
                      <NavLink to="/messages">Messages</NavLink>
                    </li>
                  </ul>
                )}
              </div>
              {!context.token && (
                <div className="main-navigation__auth">
                  <Route
                    render={({ history }) => (
                      <button
                        className="btn btn-login"
                        onClick={() => {
                          history.push("/auth");
                        }}
                      >
                        Log in
                      </button>
                    )}
                  />
                  <Route
                    render={({ history }) => (
                      <button
                        className="btn btn-signup"
                        onClick={() => {
                          history.push("/signup");
                        }}
                      >
                        Sign up
                      </button>
                    )}
                  />
                </div>
              )}
              {context.token && (
                <div className="user-photo dropdown">
                  <img
                    className="dropbtn"
                    src={context.userPhoto}
                    alt={context.userName}
                  />
                  <div className="dropdown-content">
                    <Route
                      render={({ history }) => (
                        <button
                          className="btn btn-profile"
                          onClick={() => {
                            history.push("/edit-profile");
                          }}
                        >
                          Edit profile
                        </button>
                      )}
                    />
                    <button onClick={context.logout}>Logout</button>
                  </div>
                </div>
              )}
            </header>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

const routedMainNavigation = withRouter(MainNavigation);
export default routedMainNavigation;
