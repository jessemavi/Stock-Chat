import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Message, Button, Input, Container, Header } from 'semantic-ui-react';

class Login extends Component {
  state = {
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  }

  onSubmit = async () => {
    await this.setState({
      emailError: '',
      passwordError: '',
    });

    // console.log('state', this.state);

    const {email, password} = this.state;
    
    const response = await this.props.mutate({
      variables: {email, password}
    });
    console.log('response', response);
  }

  onChange = event => {
    // console.log(event.target);
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {

    const {email, emailError, password, passwordError} = this.state;

    const errorList = [];

    if(emailError) {
      errorList.push(emailError);
    }

    if(passwordError) {
      errorList.push(passwordError);
    } 

    return (
      <Container text>

        <Header as='h2'>Login</Header>

        <Input 
          error={emailError.length > 0}
          name='email' 
          onChange={this.onChange} 
          value={email} 
          placeholder='Email' 
          fluid 
        />
        <Input 
          error={passwordError.length > 0}
          name='password' 
          onChange={this.onChange} 
          value={password} 
          placeholder='Password' 
          type='password' 
          fluid 
        />

        <Button onClick={this.onSubmit}>Submit</Button>

        {emailError || passwordError ? <Message
          error
          header='There was some errors with your submission'
          list={errorList}
        /> : null}

      </Container>
    )
  }
};

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      userLoggedIn
      token
      error 
    }
  }
`;

export default graphql(loginMutation)(Login);
