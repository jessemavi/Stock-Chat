import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';

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
    await this.setState({
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

    if(this.state.password.length <= 4) {
      await this.setState({
        passwordError: 'password must be at least 5 characters'
      });
    }

    if(this.state.usernameError.length === 0 && this.state.emailError.length === 0 && this.state.passwordError.length === 0) {
      const {username, email, password} = this.state;

      const response = await this.props.mutate({
        variables: {username, email, password}
      });
      console.log('response', response);

      if(response.data.createUser.userCreated) {
        localStorage.setItem('token', response.data.createUser.token);
        this.props.history.push('/all-users');
      } else {
        // add any errors from server to state
        if(response.data.createUser.error.indexOf('username') >= 0) {
          console.log('username error');
          await this.setState({
            usernameError: 'username already exists'
          });
        } 
        if(response.data.createUser.error.indexOf('email') >= 0) {
          console.log('email error');
          await this.setState({
            emailError: 'email already exists'
          });
        }
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

        <Form>
          <Form.Field error={usernameError.length > 0}>
            <Input 
              name='username' 
              onChange={this.onChange} 
              value={username} 
              placeholder='Username' 
              fluid 
            />
          </Form.Field>
          <Form.Field error={emailError.length > 0}>
            <Input 
              name='email' 
              onChange={this.onChange} 
              value={email} 
              placeholder='Email' 
              fluid 
            />
          </Form.Field>
          <Form.Field error={passwordError.length > 0}>
            <Input
              name='password' 
              onChange={this.onChange} 
              value={password} 
              placeholder='Password' 
              type='password' 
              fluid 
            />
          </Form.Field>
        </Form>

        <Button onClick={this.onSubmit}>Submit</Button>

        {usernameError || emailError || passwordError ? <Message
          error
          header='There were some errors with your submission'
          list={errorList}
        /> : null}

      </Container>
    )
  }
}

const signupMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      userCreated
      token
      error
    }

  }
`;

export default graphql(signupMutation)(Signup);
