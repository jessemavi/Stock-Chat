import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Card, Feed, Icon } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';
import client from '../index';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: null
    }

    console.log('client', client.cache.data.data);

    this.postQuery = gql`
      {
        post(post_id: ${this.props.match.params.post_id}) {
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

            {this.state.post.comments.length > 0 ?
              <Card.Content>
                <Feed>
                  {this.state.post.comments.map((comment, index) => {
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
        : null}
        
      </div>
    )
  }
};

export default Post;
