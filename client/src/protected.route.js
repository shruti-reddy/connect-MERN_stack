import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import auth from "./views/Auth";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (localStorage.getItem("token")) {
          return <component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/auth",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};
