import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react';
import './Profile.css';

import LoggedInHeader from './LoggedInHeader';

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

        <div className='profile-page-content'>
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
                    <Icon name='like' disabled={true} color='grey' />
                    {post.likes.length} likes
                    <Icon name='comment' />
                    {post.comments.length} comments
                </Card.Content>
              </Card>
            )
          })
          : null}
        </div>
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
