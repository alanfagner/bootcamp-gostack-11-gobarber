import React from 'react';
import {
  Redirect,
  RouteProps as ReactDomRouteProps,
  Route as ReactDomRoute,
} from 'react-router-dom';

import { useAuth } from '../hooks/Auth';
// import { Container } from './styles';
interface RouteProps extends ReactDomRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDomRoute
      {...rest}
      render={({ location }) =>
        isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : 'dashboard',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default Route;
