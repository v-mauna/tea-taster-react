import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router';
import { useAuthentication } from './useAuthentication';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { status } = useAuthentication();

  return (
    <Route
      {...rest}
      render={props =>
        status === 'authenticated' ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};
