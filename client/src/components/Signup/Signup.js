import React, { Component } from "react";
import { Route } from "react-router-dom";
import moment from "moment";
import "./Signup.css";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      knownAs: "",
      password: "",
      password2: "",
      gender: "male",
      lookingFor: "female",
      month: "01",
      date: "",
      year: "",
      city: "",
      country: "",
      didAgree: false,
      errorMessage: "",
      isValid: false,
    };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.id;
    this.setState(
      {
        [name]: value,
      },
      this.validator
    );
  };

  get isFormValid() {
    return this.state.isValid;
  }

  validator = () => {
    if (!this.state.userName || this.state.userName.length < 6) {
      this.setState({
        errorMessage: "username should be atleast 6 characters",
        isValid: false,
      });
      return;
    }
    if (!this.state.password || this.state.password.length < 6) {
      this.setState({
        errorMessage: "password should be atleast 6 characters",
        isValid: false,
      });
      return;
    }
    if (this.state.password !== this.state.password2) {
      this.setState({
        errorMessage: "password and confirm password did not match",
        isValid: false,
      });
      return;
    }

    if (!this.state.didAgree) {
      this.setState({
        isValid: false,
        errorMessage: "please agree with the terms and conditions",
      });
      return;
    }
    if (
      !moment(
        `${this.state.date}-${this.state.month}-${this.state.year}`,
        "DD-MM-YYYY",
        true
      ).isValid()
    ) {
      this.setState({
        isValid: false,
        errorMessage: "date is invalid",
      });
      return;
    }
    this.setState({ errorMessage: "", isValid: true });
  };

  onSubmit = (e) => {
    e.preventDefault();
    let dateOfBirth = "";
    if (
      moment(
        `${this.state.date}-${this.state.month}-${this.state.year}`,
        "DD-MM-YYYY",
        true
      ).isValid()
    ) {
      dateOfBirth = moment(
        `${this.state.date}-${this.state.month}-${this.state.year}`,
        "DD-MM-YYYY"
      );
    }
    console.log(dateOfBirth);
    const requestBody = {
      query: `
      mutation{
        createUser(userSaveType:{
          userName:"${this.state.userName}",
          password:"${this.state.password}",
          gender:"${this.state.gender}",
          knownAs:"${this.state.knownAs}",
          lookingFor:"${this.state.lookingFor}",
          city:"${this.state.city}",
          country:"${this.state.country}",
          dateOfBirth: "${dateOfBirth}"
        }
        ){
          userName
        }
      }
      `,
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.data.createUser.userName === this.state.userName) {
          this.props.history.push("/auth");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  render() {
    return (
      <div className="signup-section">
        <form onSubmit={this.onSubmit} className="signup-form">
          <div className="signup-form__input--userName signup-form-control">
            <label htmlFor="userName">User name*</label>
            <input
              className="signup-form__input"
              type="text"
              id="userName"
              value={this.state.userName}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__input--knownAs signup-form-control">
            <label htmlFor="knownAs">Known As</label>
            <input
              className="signup-form__input"
              type="text"
              id="knownAs"
              value={this.state.knownAs}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__input--password signup-form-control">
            <label htmlFor="password">Password*</label>
            <input
              className="signup-form__input"
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__input--password2 signup-form-control">
            <label htmlFor="password2">Confirm Password*</label>
            <input
              className="signup-form__input"
              type="password"
              id="password2"
              value={this.state.password2}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__input--gender signup-form-control">
            <label htmlFor="gender">Gender*</label>
            <select
              name="gender"
              id="gender"
              value={this.state.gender}
              onChange={this.handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="signup-form__input--lookingFor signup-form-control">
            <label htmlFor="lookingFor">Looking For</label>
            <select
              name="lookingFor"
              id="lookingFor"
              value={this.state.lookingFor}
              onChange={this.handleInputChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="signup-form__input--dateOfBirth signup-form-control">
            <label htmlFor="dateOfBirth">Date of Birth*</label>
            <div className="dateOfBirth__container">
              <div className="dateOfBirth__month">
                <label htmlFor="months">Month</label>
                <select
                  name="months"
                  id="month"
                  value={this.state.month}
                  onChange={this.handleInputChange}
                >
                  <option value="01">Jan</option>
                  <option value="02">Feb</option>
                  <option value="03">Mar</option>
                  <option value="04">Apr</option>
                  <option value="05">May</option>
                  <option value="06">Jun</option>
                  <option value="07">Jul</option>
                  <option value="08">Aug</option>
                  <option value="09">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
              </div>
              <div className="dateOfBirth__date">
                <label htmlFor="date">Date</label>
                <input
                  className="signup-form__input"
                  type="number"
                  id="date"
                  min="1"
                  max="31"
                  value={this.state.date}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="dateOfBirth__year">
                <label htmlFor="year">Year</label>
                <input
                  className="signup-form__input"
                  type="number"
                  id="year"
                  min="1950"
                  max="2020"
                  value={this.state.year}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="signup-form__input--city  signup-form-control">
            <label htmlFor="city">City</label>
            <input
              className="signup-form__input"
              type="text"
              id="city"
              value={this.state.city}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__input--city  signup-form-control">
            <label htmlFor="country">Country</label>
            <input
              className="signup-form__input"
              type="text"
              id="country"
              value={this.state.country}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="signup-form__conditions signup-form-control">
            <input
              type="checkbox"
              id="didAgree"
              name="didAgree"
              value={this.state.didAgree}
              onChange={this.handleInputChange}
            />
            <label htmlFor="terms" className="agree--text">
              I agree with Terms and Conditions
            </label>
          </div>
          <div className="signup-form__submit">
            <button
              type="submit"
              className="btn btn-signup"
              disabled={!this.isFormValid}
            >
              Sign up
            </button>
            <br />
            {this.state.errorMessage && (
              <span className="error-message">{this.state.errorMessage}</span>
            )}
          </div>
          <div className="signup--close">
            <Route
              render={({ history }) => (
                <button
                  className="btn"
                  onClick={() => {
                    history.push("/auth");
                  }}
                >
                  X
                </button>
              )}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default Signup;
