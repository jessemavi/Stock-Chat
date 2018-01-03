import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';
import client from '../index';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: null
    }

    console.log('cache in Posts constructor', client.cache.data.data);

    this.allPostsForStockQuery = gql`
      {
        allPostsForStock(stock_id: ${JSON.parse(this.props.match.params.stock_id)}) {
          id
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

    this.stockQuery = gql`
      {
        stock(stock_id: ${JSON.parse(this.props.match.params.stock_id)}) {
          symbol
          name
        }
      }
    `;
  }

  componentDidMount = async () => {
    console.log('props in componentDidMount', this.props);

    const stockQueryResponse = await client.query({
      query: this.stockQuery
    });
    // console.log('stockQueryResponse', stockQueryResponse);

    // fetching financial from external api info before posts so it will have the info when rendering
    const stockDataResponse = await(fetch(`https://api.iextrading.com/1.0/stock/${stockQueryResponse.data.stock.symbol}/quote`));
    const jsonStockDataResponse = await stockDataResponse.json();
    console.log('jsonStockDataResponse', jsonStockDataResponse);
    this.setState({
      stockData: jsonStockDataResponse
    });
    // console.log('state in componentDidMount', this.state);

    const stockPostsResponse = await client.query({
      query: this.allPostsForStockQuery
    });
    // console.log('stockPostsResponse', stockPostsResponse);
    this.setState({
      posts: stockPostsResponse.data.allPostsForStock
    });
  }

  onPostClick = (post_id) => {
    // console.log('post clicked');
    this.props.history.push(`/post/${post_id}`);
  }

  render() {
    return (
      <div>
        <LoggedInHeader />

        {this.state.stockData!== null ?
            <Card centered={true} color='green'>
              <Card.Content>
                <Card.Header>{this.state.stockData.companyName}</Card.Header>
                <Card.Meta>{this.state.stockData.primaryExchange}</Card.Meta>
                <Card.Header>{this.state.stockData.latestPrice}</Card.Header>
                <Card.Meta>{this.state.stockData.changePercent + '%'}</Card.Meta>
              </Card.Content>
            </Card>
        : null}

        {this.state.posts ? this.state.posts.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostClick.bind(this, post.id)}
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

export default Posts;
