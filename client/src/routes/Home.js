import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: { loading, error, allUsers } }) => {
  if(loading) {
    return <p>Loading</p>
  }
  if(error) {
    return <p>Error</p>
  }

  return allUsers.map(user => {
    return <h2 key={user.id}>{user.username} <br></br> {user.email}</h2>
  })
};

const allUsersQuery = gql`
  {
    allUsers {
      id
      username
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);