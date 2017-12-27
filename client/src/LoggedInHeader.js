import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class LoggedInHeader extends Component {
  onClick = () => {
    localStorage.removeItem('token');
  }

  render() {
    return (
      <Link onClick={this.onClick} to="/login">Sign Out</Link>
    )
  }
};

export default LoggedInHeader;