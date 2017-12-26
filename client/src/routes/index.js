import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import CreatePost from './CreatePost';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Home} />
      <Route path='/signup' exact component={Signup} />
      <Route path='/login' exact component={Login} />
      <Route path='/create-post' exact component={CreatePost} />
    </Switch>
  </BrowserRouter>
);