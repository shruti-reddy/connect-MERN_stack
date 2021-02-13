import React, { Component } from "react";
import { Redirect, Route } from "react-router-dom";
import { connect } from 'react-redux';

import "./Auth.css";
import * as actions from '../store/actions/index';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.userNameEl = React.createRef();
    this.passwordEl = React.createRef();

    this.state = {
      err: null,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const userName = this.userNameEl.current.value;
    const password = this.passwordEl.current.value;
    if (userName.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    this.props.onLoginSubmitted(userName, password);

    // const requestBody = {
    //   query: `
    //   {
    //     login(userName:"${userName}", password:"${password}"){
    //       token
    //       tokenExpiration
    //       userId
    //       userName
    //     }
    //   }
    //   `,
    // };

    // fetch("/graphql", {
    //   method: "POST",
    //   body: JSON.stringify(requestBody),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    // .then((r) => r.json())
    // .then((data) => {
    //   console.log(data)
    //   if (data.data && data.data.login && data.data.login.token) {
    //     localStorage.setItem("token", JSON.stringify(data.data.login.token));
    //     this.props.login(data.data.login.token);
    //     this.props.history.push("/matches");
    //     return;
    //   }
    //   if (data.errors) {
    //     this.setState({ err: data.errors[0].message });
    //   }
    // })
    // .catch((err) => {
    //   this.setState({ err });
    // });
  };
  render() {
    return this.props.isAuthenticated ? <Redirect to="/matches" /> : (<div>
      <div className="main-auth__total">
        <div className="main-auth__left">
          <div className="">
            <h1 className="auth--heading">Looking for someone?</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              animi, non, consequuntur expedita dolore sapiente g elit.
              Natus animi, non, consequuntur expedita dolore sapiente
                </p>
            <Route
              render={({ history }) => (
                <button
                  className="btn btn-cta"
                  onClick={() => {
                    history.push("/signup");
                  }}
                >
                  Sign up for free <span>&rarr;</span>
                </button>
              )}
            />
          </div>
        </div>
        <div className="main-auth__right">
          <form onSubmit={this.onSubmit} className="auth-form">
            <div className="auth-form__input">
              <div className="auth-form__input--userName">
                <label htmlFor="userName" className="form-control">
                  Username
                    </label>
                <input
                  type="text"
                  className="form-control"
                  id="userName"
                  ref={this.userNameEl}
                />
              </div>
              <div className="auth-form__input--password">
                <label htmlFor="password" className="form-control">
                  Password
                    </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  ref={this.passwordEl}
                />
              </div>
              {/* {this.state.err && <p className="error">{this.state.err}</p>} */}
            </div>
            <div className="auth-form__submit">
              <button className="btn btn-login" type="submit">
                Log in
                  </button>
              <div className="text-center margin-m-top">
                <span>or</span>
              </div>
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
          </form>
        </div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.error,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLoginSubmitted: (userName, password) => dispatch(actions.loginUser(userName, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);
