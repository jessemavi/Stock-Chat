import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Feed, Icon, Form, TextArea, Button } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';
import client from '../index';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      stockData: null,
      addCommentContent: ''
    }

    console.log('props in Post', this.props);

    console.log('client', client.cache.data.data);

    this.postQuery = gql`
      {
        post(post_id: ${JSON.parse(this.props.match.params.post_id)}) {
          content
          user {
            username
          }
          stock {
            symbol
          }
          likes {
            user {
              username
            }
          }
          comments {
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
      const response = await this.props.mutate({
        variables: { content: content, post_id: JSON.parse(this.props.match.params.post_id) }
      });
      this.setState({
        addCommentContent: ''
      });
      console.log('response comment', response);
      const comments = this.state.comments;
      comments.unshift(response.data.createComment.comment);
      await this.setState({
        comments: comments
      });
      console.log('comments in state', this.state.comments);
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
                <Card.Header>{this.state.post.user.username}</Card.Header>
                <Card.Description>{this.state.post.content}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Icon name='like' />
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
                                <Icon name='like' />
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
                <TextArea placeholder='Add a comment' style={ { maxHeight: 55 } }onChange={this.onAddCommentChange} value={this.state.addCommentContent} />
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

export default graphql(createCommentMutation)(Post);
