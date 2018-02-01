import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

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
    // if there is an old expired token in localStorage, remove it
    if(localStorage.getItem('token') !== undefined) {
      localStorage.removeItem('token');
    }
    
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
        localStorage.setItem('user_id', response.data.createUser.user_id)
        this.props.history.push('/main');
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
              {' '}Sign up for Stock-Chat
            </Header>
            <Form size='large'>
              <Segment stacked>
                <Form.Input 
                  fluid
                  icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  name='username'
                  onChange={this.onChange} 
                  value={username}
                  error={usernameError.length > 0}
                />
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

                <Button onClick={this.onSubmit} color='green' fluid size='large'>Sign Up</Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <a href='/login'>Login</a>
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
}

const signupMutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      userCreated
      token
      user_id
      error
    }

  }
`;

export default graphql(signupMutation)(Signup);
