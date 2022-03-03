import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UTILS from '@/utils';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { getToken } = UTILS.auth;
  return (
    <Route
      {...rest}
      render={(props) =>
        !!getToken() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: {from: props.location}
          }} />
        )
      }
    />
  );
};
export default PrivateRoute;
