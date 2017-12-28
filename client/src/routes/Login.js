import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Message, Button, Input, Container, Header } from 'semantic-ui-react';

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

    if(!RegExp("^[\\w-_\.+]*[\\w-_\.]\@([\\w]+\\.)+[\\w]+[\\w]$").test(this.state.email)) {
      this.setState({
        emailError: 'invalid email'
      });
    }

    if(this.state.password.length === 0) {
      this.setState({
        passwordError: 'password is required'
      });
    }

    if(this.state.emailError.length === 0 && this.state.passwordError.length === 0) {
      const {email, password} = this.state;

      const response = await this.props.mutate({
        variables: {email, password}
      });
      console.log('response', response);

      if(response.data.loginUser.userLoggedIn) {
        localStorage.setItem('token', response.data.loginUser.token);
        this.props.history.push('/main');
      } else {
        if(response.data.loginUser.error === 'email does not exist') {
          this.setState({
            emailError: 'email does not exist'
          });
        }
        if(response.data.loginUser.error === 'wrong password') {
          this.setState({
            passwordError: 'wrong password'
          });
        }
      }
    }
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

        <Form>
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

        {emailError || passwordError ? <Message
          error
          header='There were some errors with your submission'
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
