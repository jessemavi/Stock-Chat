import React, { Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown, Card, Button, Container, Icon } from 'semantic-ui-react'
import './Main.css';

import LoggedInHeader from '../LoggedInHeader';

// search bar with stocks as options
// display 10 most recent messages
  // username
  // content
  // number of likes
  // date

class Main extends Component {
  state = { 
    
  }

  handleChange = async (e, { value }) => {
    console.log('handleChange');
    await this.setState({ value })

    // stock is selected here -> move to stock posts page with posts for the stock selected
    console.log('value', value);
    // console.log('searchQuery', searchQuery);
    console.log('state after selecting a stock', this.state);
  }

  handleSearchChange = (e, { searchQuery }) => {
    // console.log('handleSearchChange');
    this.setState({ searchQuery })
  }

  onSubmit = async () => {
    if(this.state.value) {
      this.props.history.push('/create-post');
    }
  }

  onPostSubmit = async () => {
    // need to grab stock's id and then redirect to stock page
    console.log('onPostSubmit');
  }

  render() {
    console.log('props', this.props);

    const { value } = this.state
    const stateOptions = []
    let allPosts;

    if(this.props.allStocksQuery && this.props.allStocksQuery.allStocks) {
      this.props.allStocksQuery.allStocks.forEach(stock => {
        stateOptions.push({key: stock.symbol, value: stock.id, text: stock.name})
      })
    }

    if(this.props.allPostsQuery && this.props.allPostsQuery.allPosts) {
      allPosts = this.props.allPostsQuery.allPosts.slice(0, 10).reverse();
    }

    return (
      <div>
        <LoggedInHeader />
        <div className='search-container'>
          <Container textAlign='center'>
            <Dropdown
              onChange={this.handleChange}
              onSearchChange={this.handleSearchChange}
              options={stateOptions}
              placeholder='Search for a company by name and click it'
              search
              selection
              value={value}
            />
            <Button onClick={this.onSubmit}>Go</Button>
          </Container>
        </div>

        {allPosts ? allPosts.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostSubmit}
            >
              <Card.Content>
                <Card.Header>{post.user.username}</Card.Header>
                <Card.Meta>{post.stock.name}</Card.Meta>
                <Card.Meta>{post.stock.symbol}</Card.Meta>
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
};

const allStocksQuery = gql`
  {
    allStocks {
      id
      name
      symbol
    }
  }
`;

const allPostsQuery = gql`
  {
    allPosts {
      user {
        username
      }
      content
      stock {
        id
        name
        symbol
      }
      comments {
        id
      }
      likes {
        id
      }
    }
  }
`;

export default compose(
  graphql(allStocksQuery, { name: 'allStocksQuery' }),
  graphql(allPostsQuery, { name: 'allPostsQuery' })
)(Main);
