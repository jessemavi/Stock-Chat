import React, { Component } from 'react';

class LoggedInHeader extends Component {
  onClick = () => {
    localStorage.removeItem('token');
  }

  render() {
    return (
      <a onClick={this.onClick} href='/login'>Sign Out</a>
    )
  }
};

export default LoggedInHeader;
