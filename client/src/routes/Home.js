import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';

class Home extends Component {
  render() {
    return (
      <div>
        <Header>
          <Link to="/signup">Sign Up </Link>
          <Link to="/login">Login</Link>
        </Header>
      </div>
    )
  }
}

export default Home;