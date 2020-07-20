import React from "react";

export default React.createContext({
  token: null,
  userId: null,
  userName: null,
  userPhoto: null,
  login: (token) => {},
  logout: () => {},
});
