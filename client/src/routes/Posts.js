import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon, Form, TextArea, Button } from 'semantic-ui-react';
import './Posts.css';

import LoggedInHeader from '../LoggedInHeader';
import StockPriceCard from './StockPriceCard';
import client from '../index';

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      stockData: null,
      addPostContent: '',
      followingStock: false
    }

    console.log('cache in Posts constructor', client.cache.data.data);

    this.allPostsForStockQuery = gql`
      {
        allPostsForStock(stock_id: ${JSON.parse(this.props.match.params.stock_id)}) {
          id
          content
          created_at
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

    this.userFollowsStockQuery = gql`
      {
        userFollowsStock(stock_id: ${JSON.parse(this.props.match.params.stock_id)}, user_id: ${localStorage.getItem('user_id')})
      }
    `;
  }

  componentDidMount = async () => {
    // console.log('props in componentDidMount', this.props);
    console.log('client cache data in componentDidMount', client.cache.data.data);

    const stockQueryResponse = await client.query({
      query: this.stockQuery
    });
    // console.log('stockQueryResponse', stockQueryResponse);

    const userFollowsStockResponse = await client.query({
      query: this.userFollowsStockQuery
    });
    this.setState({
      followingStock: userFollowsStockResponse.data.userFollowsStock
    });

    // fetching financial from external api info before posts so it will have the info when rendering
    const stockDataResponse = await(fetch(`https://api.iextrading.com/1.0/stock/${stockQueryResponse.data.stock.symbol}/quote`));
    const jsonStockDataResponse = await stockDataResponse.json();
    // console.log('jsonStockDataResponse', jsonStockDataResponse);
    this.setState({
      stockData: jsonStockDataResponse
    });

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
    try {
      const response = await this.props.createPostMutation({
        variables: { content: content, stock_id: JSON.parse(this.props.match.params.stock_id) }
      });
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

  onStockFollow = async () => {
    try {
      const response = await this.props.followStockMutation({
        variables: { stock_id: JSON.parse(this.props.match.params.stock_id), user_id: localStorage.getItem('user_id') }
      });
      if(response.data.followStock.stockFollowed === true) {
        this.setState({
          followingStock: true
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  onStockUnfollow = async () => {
    try {
      const response = await this.props.unfollowStockMutation({
        variables: { stock_id: JSON.parse(this.props.match.params.stock_id), user_id: localStorage.getItem('user_id') }
      });
      if(response.data.unfollowStock === true) {
        this.setState({
          followingStock: false
        });
      }
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <LoggedInHeader />

        <StockPriceCard />

        <div className='posts-content'>
          {this.state.stockData!== null ?
            <div>
              <Card centered={true} color='green'>
                <Card.Content>
                  <Card.Header>
                    {`${this.state.stockData.companyName} (${this.state.stockData.symbol})`}

                    {this.state.followingStock === false ? 
                      <Button
                        compact={true} 
                        content='Follow' 
                        size={'mini'}
                        floated={'right'}
                        basic={true}
                        color={'green'}
                        onClick={this.onStockFollow}
                      >
                      </Button>
                    :
                      <Button
                        compact={true} 
                        content='Following' 
                        size={'mini'}
                        floated={'right'}
                        basic={false}
                        color={'green'}
                        onClick={this.onStockUnfollow}
                      >
                      </Button> 
                    }
                  </Card.Header>
                  <Card.Meta>{this.state.stockData.primaryExchange}</Card.Meta>
                  <Card.Header>{this.state.stockData.latestPrice}</Card.Header>
                  <Card.Meta>{this.state.stockData.changePercent + '%'}</Card.Meta>
                </Card.Content>
              </Card>

              <div className='Form'>
                <Form>
                  <TextArea placeholder={`Ask a question or share something relevant about ${this.state.stockData.companyName}`} onChange={this.onAddPostChange} value={this.state.addPostContent} style={ { maxHeight: 75 } } />
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
                  <Card.Meta>{post.created_at}</Card.Meta>
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
        created_at
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

const followStockMutation = gql`
  mutation followStockMutation($stock_id: Int!, $user_id: Int!) {
    followStock(stock_id: $stock_id, user_id: $user_id) {
      stockFollowed
      stockFollow {
        user {
          username
          email
        }
      }
      error
    }
  }
`;

const unfollowStockMutation = gql`
  mutation unfollowStockMutation($stock_id: Int!, $user_id: Int!) {
    unfollowStock(stock_id: $stock_id, user_id: $user_id)
  }
`;

export default compose(
  graphql(createPostMutation, {name: 'createPostMutation'}),
  graphql(followStockMutation, {name: 'followStockMutation'}),
  graphql(unfollowStockMutation, {name: 'unfollowStockMutation'})
)(Posts);
