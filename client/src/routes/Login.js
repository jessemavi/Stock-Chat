import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

class Login extends Component {
  state = {
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  }

  onSubmit = async () => {
    // if there is an old expired token in localStorage, remove it
    if(localStorage.getItem('token') !== undefined) {
      localStorage.removeItem('token');
    }

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
        localStorage.setItem('user_id', response.data.loginUser.user_id);
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
      <div className='login-form'>
        {/*
          Heads up! The styles below are necessary for the correct render of this example.
          You can do same with CSS, the main idea is that all the elements up to the `Grid`
          below must have a height of 100%.
        */}
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.login-form {
            height: 100%;
          }
        `}</style>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='green' textAlign='center'>
              {' '}Log-in to your account
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input
                  fluid
                  icon='mail'
                  iconPosition='left'
                  placeholder='E-mail address'
                  name='email' 
                  onChange={this.onChange} 
                  value={email} 
                  error={emailError.length > 0}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  name='password' 
                  onChange={this.onChange} 
                  value={password} 
                  error={passwordError.length > 0}
                />

                <Button onClick={this.onSubmit} color='green' fluid size='large'>Login</Button>
              </Segment>
            </Form>
            <Message>
              New to Stock-Chat? <a href='/signup'>Sign Up</a>
            </Message>
            {emailError || passwordError ? <Message
              error
              list={errorList}
            /> : null}
          </Grid.Column>
        </Grid>
      </div>
    )
  }
};

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      userLoggedIn
      token
      user_id
      error 
    }
  }
`;

export default graphql(loginMutation)(Login);
