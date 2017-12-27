import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import AllUsers from './AllUsers';
import Signup from './Signup';
import Login from './Login';
import CreatePost from './CreatePost';

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    decode(token);
    return true;
  } catch(err) {
    return false;
  }
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login'
      }}/>
    )
  )}/>
)

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/signup' exact component={Signup} />
      <Route path='/login' exact component={Login} />
      <PrivateRoute path='/all-users' exact component={AllUsers} />
      <PrivateRoute path='/create-post' exact component={CreatePost} />
    </Switch>
  </BrowserRouter>
);
