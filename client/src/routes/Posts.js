import React, { Component } from 'react';
import { graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';

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
    this.state = {
      stockData: {}
    }
  }

  // componentDidMount = async () => {
  //   const response = await(fetch('https://api.iextrading.com/1.0/stock/mmm/quote'));
  //   const jsonResponse = await response.json();
  //   console.log('json quoteData', jsonResponse);
  //   await this.setState({
  //     stockData: jsonResponse
  //   });
  //   console.log('this.state', this.state);
  // }

  componentWillReceiveProps = (props) => {
    console.log('props', props);

    if(props.data && props.data.allPostsForStock) {
      this.allPostsForStock = props.data.allPostsForStock.slice(0).reverse();
      console.log(this.allPostsForStock);
    }
  }

  onPostSubmit = () => {
    console.log('post clicked');
  }

  render() {
    return (
      <div>
        <LoggedInHeader />

        {this.state.stockData.length !== null ?
            <Card
              centered={true}
              header={this.state.stockData.latestPrice}
              color='green'
            />
        : null}

        {this.allPostsForStock ? this.allPostsForStock.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostSubmit}
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

export default graphql(allPostsForStockQuery)(Posts);
