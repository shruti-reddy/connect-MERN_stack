import axios from "axios";
import setAuthToken from "../../utils/set-auth-header";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

import login from '../../graphql/login';
import getAllUsers from '../../graphql/get-all-users'

// Register User
export const registerUser = (userData, history) => (dispatch) => {

  axios
    .post("/api/users/register", userData)
    .then((res) => history.push("/login"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Login - Get User Token
export const loginUser = (userName, password) => {
  return async dispatch => {
    try {
      const loginData = await login(userName, password);
      // Save to localStorage
      const { token } = loginData.data.login;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    }
    catch (err) {
      console.log(err)
      // dispatch({
      //   type: GET_ERRORS,
      //   payload: err.response.data,
      // })
    };
  }
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// export const getUsers = () => {
//   return dispatch => {
//     try {
//       const use
//     }
//     catch(error) {

//     }
//   }
// }