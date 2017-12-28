import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

class Home extends Component {
  render() {
    return (
      <div>
        <Header>
          <a href='/signup'>Sign Up</a>
          <a href='/login'>Login</a>
        </Header>
      </div>
    )
  }
}

export default Home;