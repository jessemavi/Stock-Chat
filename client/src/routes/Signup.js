import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Message, Button, Input, Container, Header } from 'semantic-ui-react';

class Signup extends Component {
  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  }

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });

    // validation for username, email and password
    if(this.state.username.length <= 3) {
      await this.setState({
        usernameError: 'username must be at least 4 characters'
      });
    } else if(!/^([a-zA-Z0-9_-]+)$/.test(this.state.username)) {
      await this.setState({
        usernameError: 'username must be all alphanumeric(letters and numbers) characters'
      });
    }

    if(!RegExp("^[\\w-_\.+]*[\\w-_\.]\@([\\w]+\\.)+[\\w]+[\\w]$").test(this.state.email)) {
      console.log('invalid email');
      await this.setState({
        emailError: 'invalid email'
      });
    }

    if(this.state.password.length <= 3) {
      await this.setState({
        passwordError: 'password must be at least 4 characters'
      });
    }

    if(this.state.usernameError.length === 0 && this.state.emailError.length === 0 && this.state.passwordError.length === 0) {
      const {username, email, password} = this.state;

      const response = await this.props.mutate({
        variables: {username, email, password}
      });
      console.log(response);

      if(response.data.createUser) {
        this.props.history.push('/');
      } else {
        // add any errors from server to state
      }
    }
  };

  onChange = event => {
    // console.log(event.target);
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {

    const {username, usernameError, email, emailError, password, passwordError} = this.state;

    const errorList = [];

    if(usernameError) {
      errorList.push(usernameError);
    }

    if(emailError) {
      errorList.push(emailError);
    }

    if(passwordError) {
      errorList.push(passwordError);
    } 

    return (
      <Container text>
      
        <Header as='h2'>Signup</Header>

        <Input
          error={usernameError.length > 0} 
          name='username' 
          onChange={this.onChange} 
          value={username} 
          placeholder='Username' 
          fluid 
        />
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

        {usernameError || emailError || passwordError ? <Message
          error
          header='There was some errors with your submission'
          list={errorList}
        /> : null}

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
