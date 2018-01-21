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
          id
        }
      }
    `;

    this.userFollowsStockQuery = gql`
      {
        userFollowsStock(stock_id: ${JSON.parse(this.props.match.params.stock_id)}, user_id: ${localStorage.getItem('user_id')})
      }
    `;

    const fetchPosts = async () => {
      const stockQueryResponse = await client.query({
        query: this.stockQuery
      });
      console.log('stockQueryResponse', stockQueryResponse);
      await this.setState({
        stock: stockQueryResponse.data.stock
      });

      console.log('state stock', this.state.stock);

      const stockPostsResponse = await client.query({
        query: this.allPostsForStockQuery
      });
      console.log('stockPostsResponse', stockPostsResponse);
      this.setState({
        posts: stockPostsResponse.data.allPostsForStock.slice().reverse()
      });
    }

    fetchPosts();
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

  render() {
    return (
      <div>
        <LoggedInHeader />

        <div className='posts-content'>
          {this.state.stock !== undefined ?
            <div>
              <StockPriceCard 
                stockSymbol={this.state.stock.symbol} 
                stockName={this.state.stock.name}
                stockID={this.state.stock.id}
              />

              <div className='Form'>
                <Form>
                  <TextArea placeholder={`Ask a question or share something relevant about ${this.state.stock.name}`} onChange={this.onAddPostChange} value={this.state.addPostContent} style={ { maxHeight: 75 } } />
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
                  <Icon name='like' disabled={true} color='grey' />
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

export default compose(
  graphql(createPostMutation, {name: 'createPostMutation'})
)(Posts);
