import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Feed, Icon, Form, TextArea, Button, Popup, Dropdown, Grid, Menu } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';
import client from '../index';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      stockData: null,
      addCommentContent: '',
      post: ''
    }

    console.log('props in Post', this.props);

    console.log('client', client.cache.data.data);

    this.postQuery = gql`
      {
        post(post_id: ${JSON.parse(this.props.match.params.post_id)}) {
          content
          user {
            id
            username
          }
          stock {
            id
            symbol
          }
          likes {
            user {
              id
              username
            }
          }
          comments {
            id
            content
            user {
              id
              username
            }
            likes {
              user {
                id
                username
              }
            }
          }
        }
      }
    `;
  }

  componentDidMount = async () => {
    // make request to get post data
    const postResponse = await client.query({
      query: this.postQuery
    });
    console.log('postResponse data', postResponse.data.post);
    this.setState({
      post: postResponse.data.post
    });

    const stockDataResponse = await(fetch(`https://api.iextrading.com/1.0/stock/${postResponse.data.post.stock.symbol}/quote`));
    const jsonStockDataResponse = await stockDataResponse.json();
    console.log('jsonStockDataResponse', jsonStockDataResponse);
    this.setState({
      stockData: jsonStockDataResponse
    });

    this.setState({
      comments: postResponse.data.post.comments.slice()
    });
  }

  onAddCommentChange = (event, { value }) => {
    // console.log(value);
    this.setState({
      addCommentContent: value
    });
  }

  onAddComment = async (content) => {
    // console.log('onAddComment');
    // console.log('content', content);
    // console.log(JSON.parse(this.props.match.params.post_id));
    try {
      const response = await this.props.createCommentMutation({
        variables: { content: content, post_id: JSON.parse(this.props.match.params.post_id) }
      });
      this.setState({
        addCommentContent: ''
      });
      console.log('response comment', response);
      const comments = this.state.comments;
      comments.push(response.data.createComment.comment);
      await this.setState({
        comments: comments
      });
      console.log('comments in state', this.state.comments);
    } catch(err) {
      console.log(err);
    }
  }

  onPostLikeClick = async () => {
    // console.log('post liked');
    try {
      const response = await this.props.createLikeMutation({
        variables: { post_id: JSON.parse(this.props.match.params.post_id), user_id: localStorage.getItem('user_id') }
      });
      console.log('response', response);
      await this.setState({
        post: response.data.createLike.like.post
      });
    } catch(err) {
      console.log(err);
    }
  }

  onCommentLikeClick = async (commentID) => {
    // console.log('comment liked');
    // console.log('commentID', commentID);
    try {
      const response = await this.props.createLikeMutation({
        variables: { comment_id: commentID, post_id: JSON.parse(this.props.match.params.post_id), user_id: localStorage.getItem('user_id') }
      });
      console.log('response', response);
      await this.setState({
        comments: response.data.createLike.like.post.comments.slice()
      });
      console.log('state after comment like', this.state.comments);
    } catch(err) {
      console.log(err);
    }
  }

  onDeletePost = async () => {
    try {
      await this.props.deletePostMutation({
        variables: { post_id: this.props.match.params.post_id }
      });
      this.props.history.push(`/posts/${this.state.post.stock.id}`);
    } catch(err) {
      console.log(err);
    }
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

        {this.state.post ? 
          <div>
            <Card centered={true}>
              <Card.Content>
                <Card.Header>
                  {this.state.post.user.username}
                  {this.state.post.user.id === JSON.parse(localStorage.getItem('user_id')) ?
                    <Dropdown className='post-delete-icon' icon='chevron down' upward={false}>
                      <Dropdown.Menu>
                        <Dropdown.Item text={'Delete Post'} onClick={this.onDeletePost} />
                      </Dropdown.Menu>
                    </Dropdown>
                  : null}
                </Card.Header>
                <Card.Description>{this.state.post.content}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Icon 
                  name='like' 
                  onClick={
                    this.state.post.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? null : this.onPostLikeClick
                  } 
                  color={
                    this.state.post.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? 'red' : null
                  }
                />
                {this.state.post.likes.length} likes
                <Icon name='comment' />
                {this.state.post.comments.length} comments
              </Card.Content>

              {this.state.comments.length > 0 ?
                <Card.Content>
                  <Feed>
                    {this.state.comments.map((comment, index) => {
                      return (
                        <Feed.Event key={index}>
                          <Feed.Content>
                            <Feed.Summary>
                              {comment.user.username}
                              <Feed.Date>4 days ago</Feed.Date>
                            </Feed.Summary>
                            <Feed.Extra text>
                              {comment.content}
                            </Feed.Extra>
                            <Feed.Meta>
                              <Feed.Like>
                                <Icon 
                                  name='like'
                                  onClick={
                                    comment.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? null : this.onCommentLikeClick.bind(this, comment.id)
                                  }
                                  color={
                                    comment.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? 'red' : null
                                  }
                                />
                                {comment.likes.length} Likes
                              </Feed.Like>
                            </Feed.Meta>
                          </Feed.Content>
                        </Feed.Event>
                      )
                    })}
                  </Feed>
                </Card.Content>
              : null}
            </Card>
            <div className='Form'>
              <Form>
                <TextArea 
                  placeholder='Add a comment' 
                  style={ { maxHeight: 55 } } 
                  value={this.state.addCommentContent} 
                  onChange={this.onAddCommentChange}
                />
                <Button 
                  disabled={this.state.addCommentContent.length === 0}
                  content='Add Comment'
                  labelPosition='left' 
                  icon='edit' 
                  color='green' 
                  size='tiny'
                  onClick={this.onAddComment.bind(this, this.state.addCommentContent)}
                />
              </Form>
            </div>
          </div>
        : null}

      </div>
    )
  }
};

const createCommentMutation = gql`
  mutation createCommentMutation($content: String!, $post_id: Int!) {
    createComment(content: $content, post_id: $post_id) {
      commentCreated
      comment {
        id
        content
        user {
          username
        }
        likes {
          user {
            username
          }
        }
      }
      error
    }
  }
`;

// createLikeMutation should return the same exact ids that postQuery does to avoid throwing an error
// https://github.com/apollographql/apollo-client/issues/2510

const createLikeMutation = gql`
  mutation createLikeMutation($post_id: Int, $comment_id: Int, $user_id: Int!) {
    createLike(post_id: $post_id, comment_id: $comment_id, user_id: $user_id) {
      likeCreated
      like {
        post {
          content
          user {
            id
            username
          }
          stock {
            id
            symbol
          }
          likes {
            user {
              id
              username
            }
          }
          comments {
            id
            content
            user {
              id
              username
            }
            likes {
              user {
                id
                username
              }
            }
          }
        }
      }
      error
    }
  }
`;

const deletePostMutation = gql`
  mutation deletePostMutation($post_id: Int!) {
    deletePost(post_id: $post_id)
  }
`;

export default compose(
  graphql(createCommentMutation, {name: 'createCommentMutation'}),
  graphql(createLikeMutation, {name: 'createLikeMutation'}),
  graphql(deletePostMutation, {name: 'deletePostMutation'})
)(Post);
