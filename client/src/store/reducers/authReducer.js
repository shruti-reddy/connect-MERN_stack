import isEmpty from "../../validations/is-empty";

import { SET_CURRENT_USER, SET_CURRENT_USER_PHOTO } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  error: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case SET_CURRENT_USER_PHOTO:
      let updatedUser = { ...state.user };
      updatedUser.userPhoto = action.payload;
      return {
        ...state,
        user: updatedUser
      }
    default:
      return state;
  }
}
