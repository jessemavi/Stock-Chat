import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react';

// allPosts query
  // content
  // stock
  // user
    // username
  // comments (display number of comments)
  // likes (display number of likes)
    // user
      // username

// createPost mutation
// removePost mutation
// createLike mutation
// removeLike mutation


class Posts extends Component {
  constructor() {
    super();

    this.allPostsForStock = null;
  }

  componentWillReceiveProps = async(props) => {
    console.log('props', props);

    if(props.allPostsForStockQuery && props.allPostsForStockQuery.allPostsForStock) {
      this.allPostsForStock = props.allPostsForStockQuery.allPostsForStock.slice(0).reverse();
      console.log(this.allPostsForStock);
    }
  }

  render() {
    return (
      <div>
        {this.allPostsForStock ? this.allPostsForStock.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
            >
              <Card.Content>
                <Card.Header>{post.user.username}</Card.Header>
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
        }) : null}
      </div>
    )
  }
}

const allPostsForStockQuery = gql`
  {
    allPostsForStock(stock_id: 1) {
      content
      user {
        username
      }
      likes {
        user {
          id
        }
      }
      comments {
        user {
          id
        }
      }
    }
  }
`;

export default compose(
  graphql(allPostsForStockQuery, {name: 'allPostsForStockQuery'})
)(Posts);
