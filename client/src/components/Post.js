import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Feed, Icon, Form, TextArea, Button, Dropdown } from 'semantic-ui-react';
import './Post.css';

import LoggedInHeader from './LoggedInHeader';
import StockPriceCard from './StockPriceCard';
import client from '../index';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      addCommentContent: '',
      post: '',
      followingStock: false
    }

    // console.log('props in Post', this.props);
    // console.log('client', client.cache.data.data);

    this.postQuery = gql`
      {
        post(post_id: ${JSON.parse(this.props.match.params.post_id)}) {
          content
          created_at
          user {
            id
            username
          }
          stock {
            id
            symbol
            name
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
            created_at
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

    const fetchPost = async () => {
      // make request to get post data
      const postResponse = await client.query({
        query: this.postQuery
      });
      console.log('postResponse data', postResponse.data.post);
      await this.setState({
        post: postResponse.data.post
      });

      this.setState({
        comments: postResponse.data.post.comments.slice()
      });
    };

    fetchPost();
  }
  

  onAddCommentChange = (event, { value }) => {
    this.setState({
      addCommentContent: value
    });
  }

  onAddComment = async (content) => {
    try {
      const response = await this.props.createCommentMutation({
        variables: { content: content, post_id: JSON.parse(this.props.match.params.post_id) }
      });
      this.setState({
        addCommentContent: ''
      });
      // console.log('response comment', response);
      const comments = this.state.comments;
      comments.push(response.data.createComment.comment);
      await this.setState({
        comments: comments
      });
    } catch(err) {
      console.log(err);
    }
  }

  onPostLikeClick = async () => {
    try {
      const response = await this.props.createLikeMutation({
        variables: { post_id: JSON.parse(this.props.match.params.post_id) }
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
        variables: { comment_id: commentID, post_id: JSON.parse(this.props.match.params.post_id) }
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

  onDeleteComment = async (commentID) => {
    // console.log('commentID', commentID);
    try {
      const response = await this.props.deleteCommentMutation({
        variables: { comment_id: commentID, user_id: localStorage.getItem('user_id') }
      });
      // console.log('response from onDeleteComment', response);
      const commentsFromResponse = response.data.deleteComment.comment.post.comments;
      await this.setState({
        comments: commentsFromResponse
      });
    } catch(err) {
      console.log(err);
    }
  }

  onPostRemoveLikeClick = async () => {
    try {
      const response = await this.props.removeLikeMutation({
        variables: { post_id: JSON.parse(this.props.match.params.post_id) }
      });
      console.log('response from removeLikeMutation', response);
      await this.setState({
        post: response.data.removeLike.like.post
      });
    } catch(err) {
      console.log(err);
    }
  }

  onCommentRemoveLikeClick = async (commentID) => {
    try {
      const response = await this.props.removeLikeMutation({
        variables: { comment_id: commentID, post_id: JSON.parse(this.props.match.params.post_id) }
      });
      await this.setState({
        comments: response.data.removeLike.like.post.comments.slice()
      });
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div>
        <LoggedInHeader />
        
        <div className='post-content'>
          {this.state.post ? 
            <StockPriceCard 
              stockSymbol={this.state.post.stock.symbol} 
              stockName={this.state.post.stock.name}
              stockID={this.state.post.stock.id}
            />
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
                  <Card.Meta>{this.state.post.created_at}</Card.Meta>
                  <Card.Description>{this.state.post.content}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Icon 
                    name='like' 
                    onClick={
                      this.state.post.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? this.onPostRemoveLikeClick : this.onPostLikeClick
                    } 
                    color={
                      this.state.post.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? 'red' : null
                    }
                  />
                  {this.state.post.likes.length} likes
                  <Icon name='comment' />
                  {this.state.comments.length} comments
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
                                <Feed.Date>{comment.created_at}</Feed.Date>
                                {comment.user.id === JSON.parse(localStorage.getItem('user_id')) ?
                                  <Dropdown className='comment-delete-icon' icon='chevron down' upward={false}>
                                    <Dropdown.Menu>
                                      <Dropdown.Item text={'Delete Comment'} onClick={this.onDeleteComment.bind(this, comment.id)} />
                                    </Dropdown.Menu>
                                  </Dropdown>
                                : null}
                              </Feed.Summary>
                              <Feed.Extra text>
                                {comment.content}
                              </Feed.Extra>
                              <Feed.Meta>
                                <Feed.Like>
                                  <Icon 
                                    name='like'
                                    onClick={
                                      comment.likes.filter(like => like.user.id === JSON.parse(localStorage.getItem('user_id'))).length > 0 ? this.onCommentRemoveLikeClick.bind(this, comment.id) : this.onCommentLikeClick.bind(this, comment.id)

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
        created_at
        user {
          id
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
  mutation createLikeMutation($post_id: Int, $comment_id: Int) {
    createLike(post_id: $post_id, comment_id: $comment_id) {
      likeCreated
      like {
        post {
          content
          created_at
          user {
            id
            username
          }
          stock {
            id
            name
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
            created_at
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

const removeLikeMutation = gql`
  mutation removeLikeMutation($post_id: Int, $comment_id: Int) {
    removeLike(post_id: $post_id, comment_id: $comment_id) {
      likeRemoved
      like {
        post {
          content
          created_at
          user {
            id
            username
          }
          stock {
            id
            name
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
            created_at
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

const deleteCommentMutation = gql`
  mutation deleteCommentMutation($comment_id: Int!, $user_id: Int!) {
    deleteComment(comment_id: $comment_id, user_id: $user_id) {
      commentDeleted
      comment {
        post {
          comments {
            id
            content
            created_at
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

export default compose(
  graphql(createCommentMutation, {name: 'createCommentMutation'}),
  graphql(deleteCommentMutation, {name: 'deleteCommentMutation'}),
  graphql(createLikeMutation, {name: 'createLikeMutation'}),
  graphql(removeLikeMutation, {name: 'removeLikeMutation'}),
  graphql(deletePostMutation, {name: 'deletePostMutation'}),
)(Post);
