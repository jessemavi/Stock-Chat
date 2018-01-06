import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import decode from 'jwt-decode';

import Home from './Home';
import Main from './Main';
import AllUsers from './AllUsers';
import Signup from './Signup';
import Login from './Login';
import CreatePost from './CreatePost';
import Posts from './Posts';
import Post from './Post';
import Profile from './Profile';

const isAuthenticated = () => {
  console.log('isAuthenticated');
  try {
    const token = localStorage.getItem('token');
    decode(token);
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
      <PrivateRoute path='/all-users' exact component={AllUsers} />
      <PrivateRoute path='/create-post' exact component={CreatePost} />
    </Switch>
  </BrowserRouter>
);
