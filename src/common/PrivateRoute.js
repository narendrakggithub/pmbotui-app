import React from 'react';
import {
  Route,
  Redirect
} from "react-router-dom";


const PrivateRoute = ({ component: Component, authenticated, roles, currentUser, ...rest }) => (
  <Route
  {...rest}
    render={props => {

      if(!authenticated) {
        return <Redirect to={{pathname: '/login', state: { from: props.location }}} />
      }

      let result = roles.filter(o1 => currentUser.authorities.some(o2 => o1 === o2.authority));

      if (roles && !result.length) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/'}} />
      }
      return <Component {...rest} {...props} />
    }
  }
  />
);

export default PrivateRoute