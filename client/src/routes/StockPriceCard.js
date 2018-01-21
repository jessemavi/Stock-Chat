import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Card, Feed, Icon, Form, TextArea, Button, Dropdown } from 'semantic-ui-react';

import client from '../index';

class StockPriceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: 'Microsoft Corporation',
      symbol: 'MSFT',
      followingStock: false
    }

    this.userFollowsStockQuery = gql`
      query userFollowsStockQuery($stock_id: Int!, $user_id: Int!) {
        userFollowsStock(stock_id: $stock_id, user_id: $user_id)
      }
    `;

    console.log('props in StockPriceCard', this.props);

    const fetchStockPriceData = async () => {
      const userFollowsStockResponse = await client.query({
        query: this.userFollowsStockQuery, 
        variables: {
          stock_id: this.props.stockID,
          user_id: localStorage.getItem('user_id')
        }
      });
      console.log('userFollowsStockResponse', userFollowsStockResponse);

      this.setState({
        followingStock: userFollowsStockResponse.data.userFollowsStock
      });

      const stockDataResponse = await(fetch(`https://api.iextrading.com/1.0/stock/${this.props.stockSymbol}/quote`));
      const jsonStockDataResponse = await stockDataResponse.json();
      console.log('jsonStockDataResponse in StockPriceCard', jsonStockDataResponse);
      await this.setState({
        stockData: jsonStockDataResponse
      });
    };

    fetchStockPriceData();
  }

  onStockFollow = async () => {
    try {
      const response = await this.props.followStockMutation({
        variables: { stock_id: this.props.stockID, user_id: localStorage.getItem('user_id') }
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
        variables: { stock_id: this.props.stockID, user_id: localStorage.getItem('user_id') }
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
      <Card centered={true} color='green'>
        <Card.Content>
          <Card.Header>
            {`${this.props.stockName} (${this.props.stockSymbol})`}

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
          {this.state.stockData ?
            <div>
              <Card.Meta>{this.state.stockData.primaryExchange}</Card.Meta>
              <Card.Header>{this.state.stockData.latestPrice}</Card.Header>
              <Card.Meta>{this.state.stockData.changePercent + '%'}</Card.Meta>
            </div>
          : null}
        </Card.Content>
      </Card>
    )
  }
}

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
  graphql(followStockMutation, {name: 'followStockMutation'}),
  graphql(unfollowStockMutation, {name: 'unfollowStockMutation'})
)(StockPriceCard);
