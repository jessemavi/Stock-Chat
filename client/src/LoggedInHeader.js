import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Menu, Container, Button, Grid, Popup } from 'semantic-ui-react';

import client from './index';

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
      <Menu size='huge'>
        <Container>
          <Menu.Menu position='left'>
            <Menu.Item>Stock Chat</Menu.Item>
          </Menu.Menu>
          <Menu.Menu position='right'>
            <Menu.Item fitted='vertically'>
              <Popup trigger={<Button content={this.state.user.username} color='green' />} on='click' size='large'>
                <Grid divided columns='equal' >
                  <Grid.Row>
                    <Menu.Item name='Profile' href='/profile'></Menu.Item>
                  </Grid.Row>
                  <Grid.Row>
                    <Menu.Item name='Sign Out' onClick={this.onSignOutClick} href='login'></Menu.Item>
                  </Grid.Row>
                </Grid>
              </Popup>
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
};

export default LoggedInHeader;
