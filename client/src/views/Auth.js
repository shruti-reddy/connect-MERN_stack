import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import { Route } from "react-router-dom";
import "./Auth.css";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.userNameEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  static contextType = AuthContext;
  onSubmit = async (event) => {
    event.preventDefault();
    const userName = this.userNameEl.current.value;
    const password = this.passwordEl.current.value;
    if (userName.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    const requestBody = {
      query: `
      {
        login(userName:"${userName}", password:"${password}"){
          token
          tokenExpiration
          userId
          userName
        }
      }
      `,
    };

    //console.log(requestBody);

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data && data.data.login && data.data.login.token) {
          localStorage.setItem("token", JSON.stringify(data.data.login.token));
          this.context.login(data.data.login.token);
          this.props.history.push("/matches");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="main-auth__total">
        <div className="main-auth__left">
          <div className="">
            <h1 className="auth--heading">Looking for someone?</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus
              animi, non, consequuntur expedita dolore sapiente g elit. Natus
              animi, non, consequuntur expedita dolore sapiente
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
    );
  }
}

export default AuthPage;
