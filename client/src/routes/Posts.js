import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon, Form, TextArea, Button } from 'semantic-ui-react';
import './Posts.css';

import LoggedInHeader from '../LoggedInHeader';
import client from '../index';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      stockData: null,
      addPostContent: ''
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
    console.log('stockPostsResponse', stockPostsResponse);
    this.setState({
      posts: stockPostsResponse.data.allPostsForStock.slice().reverse()
    });
  }

  onPostClick = (post_id) => {
    // console.log('post clicked');
    this.props.history.push(`/post/${post_id}`);
  }

  onAddPostChange = (event, { value }) => {
    // console.log('value', value);
    this.setState({
      addPostContent: value
    })
  }

  onAddPost = async (content) => {
    console.log();
    try {
      const response = await this.props.mutate({
        variables: { content: content, stock_id: JSON.parse(this.props.match.params.stock_id) }
      })
      this.setState({
        addPostContent: ''
      });
      console.log('response', response);
      const posts = this.state.posts;
      posts.unshift(response.data.createPost.post)
      await this.setState({
        posts: posts
      });
      console.log('updated posts in state', this.state.posts);
    } catch(err) {
      console.log(err);
    }
  }

  render() {

    return (
      <div>
        <LoggedInHeader />

        {this.state.stockData!== null ?
          <div>
            <Card centered={true} color='green'>
              <Card.Content>
                <Card.Header>{`${this.state.stockData.companyName} (${this.state.stockData.symbol})`}</Card.Header>
                <Card.Meta>{this.state.stockData.primaryExchange}</Card.Meta>
                <Card.Header>{this.state.stockData.latestPrice}</Card.Header>
                <Card.Meta>{this.state.stockData.changePercent + '%'}</Card.Meta>
              </Card.Content>
            </Card>

            <div className='Form'>
              <Form>
                <TextArea placeholder={`Ask a question or share something relevant about ${this.state.stockData.companyName}`} onChange={this.onAddPostChange} value={this.state.addPostContent} style={ { minHeight: 75 } } />
                <Button 
                  disabled={this.state.addPostContent.length === 0}
                  content='Add Post' 
                  labelPosition='left' 
                  icon='edit' 
                  color='green' 
                  size='tiny'
                  onClick={this.onAddPost.bind(this, this.state.addPostContent)}
                />
              </Form>
            </div>
          </div>
        : null}

        {this.state.posts.length > 0 ? this.state.posts.map((post, index) => {
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

const createPostMutation = gql`
  mutation createPostMutation($content: String!, $stock_id: Int!) {
    createPost(content: $content, stock_id: $stock_id) {
      postCreated
      post {
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
      error
    }
  }
`;

export default graphql(createPostMutation)(Posts);
