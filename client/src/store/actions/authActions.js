import axios from "axios";
import setAuthToken from "../../utils/set-auth-header";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER } from "./types";

import login from '../../graphql/login';

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
      dispatch(setCurrentUser({ ...decoded, token: token }));
      //create timer to logout user after token expires
      dispatch(checkAuthTimeout(decoded.exp - decoded.iat));
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

export const checkAuthState = () => {
  return dispatch => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      dispatch(logoutUser());
    }
    else {
      const decoded = jwt_decode(token);
      const expirationDate = new Date(new Date().getTime() + (decoded.exp / 1000));
      if (expirationDate <= new Date()) {
        dispatch(logoutUser());
      }
      else {
        dispatch(setCurrentUser({ ...decoded, token: token }));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000))
      }
    }
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logoutUser());
    }, 3600 * 1000);
  };
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