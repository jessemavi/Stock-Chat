import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './components/Home';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import Posts from './components/Posts';
import Post from './components/Post';
import Profile from './components/Profile';

const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    decode(token);
    console.log('token decoded');
    return true;
  } catch(err) {
    console.log('err in isAuthenticated', err);
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
      <PrivateRoute path='/main' exact component={Main} />
      <PrivateRoute path='/profile' exact component={Profile} />
      <PrivateRoute path='/posts/:stock_id' exact component={Posts} />
      <PrivateRoute path='/post/:post_id' exact component={Post} />
    </Switch>
  </BrowserRouter>
);
