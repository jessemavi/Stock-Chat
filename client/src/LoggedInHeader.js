import React, { Component } from 'react';
import { Menu, Container, Button, Grid, Popup } from 'semantic-ui-react';

class LoggedInHeader extends Component {
  onClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
  }

  render() {
    return (
      <Menu size='large'>
        <Container>
          <Menu.Menu position='left'>
            <Menu.Item>Stock Chat</Menu.Item>
          </Menu.Menu>
          <Menu.Menu position='right'>
            <Menu.Item fitted='vertically'>
              <Popup wide trigger={<Button content='Username' color='green' />} on='click'>
                  <Grid divided columns='equal'>
                    <Button content='Profile' basic color='green' fluid />
                    <Button onClick={this.onClick} href='/login' content='Logout' basic color='green' fluid />
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
