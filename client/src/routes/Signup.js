import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Input, Container, Header } from 'semantic-ui-react';

class Signup extends Component {
  state = {
    username: '',
    email: '',
    password: '',
  }

  onSubmit = async () => {
    // console.log(this.state);
    const response = await this.props.mutate({
      variables: this.state
    });
    console.log(response);
  };

  onChange = event => {
    // console.log(event.target);
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {

    const {username, email, password} = this.state;

    return (
      <Container text>
        <Header as='h2'>Signup</Header>
        <Input 
          name='username' 
          onChange={this.onChange} 
          value={username} 
          placeholder='Username' 
          fluid 
        />
        <Input 
          name='email' 
          onChange={this.onChange} 
          value={email} 
          placeholder='Email' 
          fluid 
        />
        <Input 
          name='password' 
          onChange={this.onChange} 
          value={password} 
          placeholder='Password' 
          type='password' 
          fluid 
        />
        <Button onClick={this.onSubmit}>Submit</Button>
      </Container>
    )
  }
}

const signupMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password)

  }
`;

export default graphql(signupMutation)(Signup);
