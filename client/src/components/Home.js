import React, { Component } from 'react';
import { Header, Button } from 'semantic-ui-react';

class Home extends Component {
  render() {
    return (
      <div>
        <Header
          className
          size='huge' 
          textAlign='center'
        >
          Stock Chat
        </Header>
        <div>
          <Button 
            size='big' 
            content='Sign Up' 
            onClick={() => this.props.history.push('/signup')}
          >
          </Button>
          <Button 
            size='big' 
            content='Login'
            onClick={() => this.props.history.push('/login')}
          >
          </Button>
        </div>
      </div>
    )
  }
}

export default Home;
