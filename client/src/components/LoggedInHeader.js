import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Menu, Container, Dropdown } from 'semantic-ui-react';

import client from '../index';

class LoggedInHeader extends Component {
  state = {
    user: ''
  }

  getUserQuery = gql`
    {
      getUser(user_id: ${JSON.parse(localStorage.getItem('user_id'))}) {
        username
      }
    }
  `;

  componentDidMount = async () => {
    const userResponse = await client.query({
      query: this.getUserQuery
    });
    // console.log('userResponse', userResponse);
    this.setState({
      user: userResponse.data.getUser
    });
  }

  onSignOutClick = () => {
    console.log('onSignOutClick');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  render() {
    return (
      <Menu size='huge' fixed={'top'}>
        <Container>
          <Menu.Menu position='left'>
            <Menu.Item href='/main'>Stock Chat</Menu.Item>
          </Menu.Menu>

          <Menu.Menu position='right'>          
            <Menu.Item>
              <Dropdown text={this.state.user.username} icon='user outline'>
                <Dropdown.Menu>
                  <Dropdown.Item text='Profile' href='/profile' />
                  <Dropdown.Item text='Sign Out' onClick={this.onSignOutClick} href='/login' />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>

        </Container>
      </Menu>
    )
  }
};

export default LoggedInHeader;
