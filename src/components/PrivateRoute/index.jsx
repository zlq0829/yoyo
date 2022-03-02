import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import UTILS from '@/utils';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { getLocal } = UTILS.localCache;
  return (
    <Route
      {...rest}
      render={(props) =>
        !getLocal('token') ? (
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
