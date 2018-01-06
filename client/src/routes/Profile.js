import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react'

import LoggedInHeader from '../LoggedInHeader';

// can wrap request in higher order component
// make request for all posts from user
// make request for all posts liked by user
// probably won't need to have state to store data
// render cards with links

class Profile extends Component {

  onPostClick = async (post_id) => {
    this.props.history.push(`/post/${post_id}`);
  }

  render() {
    console.log('props in Profile', this.props);

    let allPostsForUser;

    if(this.props.data.allPostsForUser) {
      allPostsForUser = this.props.data.allPostsForUser.slice().reverse();
      console.log('allPostsForUser', allPostsForUser);
    }

    return (
      <div>
        <LoggedInHeader />

        {allPostsForUser ? allPostsForUser.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostClick.bind(this, post.id)}
            >
              <Card.Content>
                <Card.Header>{post.user.username}</Card.Header>
                <Card.Meta>{post.stock.name}</Card.Meta>
                <Card.Meta>{post.stock.symbol}</Card.Meta>
                <Card.Description>{post.content}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                  <Icon name='like' />
                  {post.likes.length} likes
                  <Icon name='comment' />
                  {post.comments.length} comments
              </Card.Content>
            </Card>
          )
        })
        : null}
      </div>
    )
  }
}

const allPostsForUser = gql`
  {
    allPostsForUser {
      id
      content
      user {
        username
      }
      stock {
        name
        symbol
      }
      comments {
        user {
          username
        }
      }
      likes {
        user {
          username
        }
      }
      
    }
  }
`;

export default graphql(allPostsForUser)(Profile);