import React, { Component} from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react'
import './Main.css';

import LoggedInHeader from './LoggedInHeader';
import StockSearchDropdown from './StockSearchDropdown';

class Main extends Component {

  onPostClick = async (post_id) => {
    // need to grab stock's id and then redirect to stock page
    console.log('onPostSubmit');
    this.props.history.push(`/post/${post_id}`);
  }

  render() {

    let allPosts;

    if(this.props.allPostsQuery && this.props.allPostsQuery.allPosts) {
      allPosts = this.props.allPostsQuery.allPosts.slice(0, 10).reverse();
      console.log('allPosts', allPosts);
    }

    return (
      <div>
        <LoggedInHeader />

        <StockSearchDropdown propsFromMainComponent={this.props} />

        {allPosts ? allPosts.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostClick.bind(this, post.id)}
            >
              <Card.Content>
                <Card.Header>{post.user.username}</Card.Header>
                <Card.Meta>{post.stock.name} {`(${post.stock.symbol})`}</Card.Meta>
                <Card.Meta>{post.created_at}</Card.Meta>
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
        }) : null}

      </div>
    )
  }
};

const allPostsQuery = gql`
  {
    allPosts {
      id
      created_at
      user {
        username
      }
      content
      stock {
        id
        name
        symbol
      }
      comments {
        id
      }
      likes {
        id
      }
    }
  }
`;

export default graphql(allPostsQuery, { name: 'allPostsQuery' })(Main);
