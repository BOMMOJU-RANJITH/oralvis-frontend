// ProtectedRoute.js
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Helper function to check token & role
function isAuthenticated(roleRequired) {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    return payload.role === roleRequired;
  } catch (err) {
    return false;
  }
}

class ProtectedRoute extends Component {
  render() {
    const { component: Component, role, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated(role) ? (
            <Component {...props} />
          ) : (
            <Redirect to="/" />
          )
        }
      />
    );
  }
}

export default ProtectedRoute;
