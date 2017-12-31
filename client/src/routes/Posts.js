import React, { Component } from 'react';
import { graphql} from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Icon } from 'semantic-ui-react';

import LoggedInHeader from '../LoggedInHeader';

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      stockData: {}
    }
    console.log('localStorage stock_id', localStorage.getItem('stock_id'))
  }

  componentDidMount = async () => {
    console.log('props in componentDidMount', this.props);
    if(this.props.data.allPostsForStock) {
      // **refetch working but not using passed in arguments and is using old arguments
      // fix: reload the page when component is rendered
      // await this.props.data.refetch( {stock_id: JSON.parse(localStorage.getItem('stock_id'))} );
      window.location.reload();
      // console.log( 'refetch result', await this.props.data.refetch( {stock_id: JSON.parse(localStorage.getItem('stock_id'))} ) )
    }
    await this.setState({
      stock_id: JSON.parse(localStorage.getItem('stock_id'))
    })
    const response = await(fetch('https://api.iextrading.com/1.0/stock/mmm/quote'));
    const jsonResponse = await response.json();
    console.log('json quoteData', jsonResponse);
    await this.setState({
      stockData: jsonResponse
    });
    // console.log('this.state', this.state);
  }

  componentWillReceiveProps = async (props) => {
    console.log('props in componentWillReceiveProps', props);

    if(props.data && props.data.allPostsForStock) {
      this.allPostsForStock = props.data.allPostsForStock.slice(0).reverse();
      console.log('allPostsForStock', this.allPostsForStock);
    }
    // allPostsForStockQuery(this.props.match.params.stock_id);
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
    allPostsForStock(stock_id: ${JSON.parse(localStorage.getItem('stock_id'))}) {
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
