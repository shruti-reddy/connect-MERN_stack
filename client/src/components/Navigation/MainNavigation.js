import React, { Component } from "react";
import { NavLink, Route, withRouter } from "react-router-dom";
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

import "./MainNavigation.css";

class MainNavigation extends Component {
  onHome = () => { };

  logout = () => {
    this.props.onLogoutUser();
    this.props.history.push("/auth");
  }

  render() {
    return (
      <header className="main-navigation">
        <div className="main-navigation__logo" onClick={this.onHome()}>
          <h1>Connect</h1>
        </div>
        <div className="main-navigation__total-items">
          {this.props.isAuthenticated && <div className="main-navigation__items">
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
          </div>}
          {!this.props.isAuthenticated && <div className="main-navigation__auth">
            <Route
              render={({ history }) => (
                <button
                  className="btn btn-login"
                  onClick={() => {
                    history.push("/auth");
                  }}>Log in</button>
              )}
            />
            <Route
              render={({ history }) => (
                <button
                  className="btn btn-signup"
                  onClick={() => {
                    history.push("/signup");
                  }}>Sign up</button>
              )}
            />
          </div>}
          {this.props.isAuthenticated && <div className="user-photo dropdown">
            <img
              className="dropbtn"
              src={this.props.user.userPhoto || require("../../assets/unknown-user.png")}
              alt={"context username"}
            />
            <div className="dropdown-content">
              <Route
                render={({ history }) => (
                  <button className="btn btn-profile"
                    onClick={() => {
                      history.push("/myprofile");
                    }}
                  >Edit profile</button>
                )}
              />
              <button onClick={() => this.logout()}> Logout </button>
            </div>
          </div>}
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    isAuthenticated: state.auth.isAuthenticated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogoutUser: () => dispatch(actions.logoutUser())
  }
}

const routedMainNavigation = withRouter(connect(mapStateToProps, mapDispatchToProps)(MainNavigation));
export default routedMainNavigation;
