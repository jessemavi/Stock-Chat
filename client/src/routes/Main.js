import React, { Component} from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown, Card, Container, Icon } from 'semantic-ui-react'
import './Main.css';

import LoggedInHeader from '../LoggedInHeader';

class Main extends Component {

  state = { 
    
  }

  onChange = async (event, { value }) => {
    console.log('handleChange');
    await this.setState({ value })
    // stock is selected here -> move to stock posts page with posts for the stock selected
    console.log('value', value);
    this.props.history.push(`/posts/${value}`);
  }

  onPostClick = async (post_id) => {
    // need to grab stock's id and then redirect to stock page
    console.log('onPostSubmit');
    this.props.history.push(`/post/${post_id}`);
  }

  render() {
    // console.log('props', this.props);

    const { value } = this.state
    const stateOptions = []
    let allPosts;

    if(this.props.allStocksQuery && this.props.allStocksQuery.allStocks) {
      this.props.allStocksQuery.allStocks.forEach((stock, index) => {
        stateOptions.push({key: index, value: stock.id, text: `${stock.name} (${stock.symbol})`})
      })
      // console.log('stateOptions', stateOptions);
    }

    if(this.props.allPostsQuery && this.props.allPostsQuery.allPosts) {
      allPosts = this.props.allPostsQuery.allPosts.slice(0, 10).reverse();
      console.log('allPosts', allPosts);
    }

    return (
      <div>
        <LoggedInHeader />
        <div className='search-container'>
          <Container textAlign='center'>
            <Dropdown
              placeholder='Search for a company by name or symbol'
              fluid
              search
              selection
              selectOnBlur={false}
              selectOnNavigation={false}
              options={stateOptions}
              value={value}
              onChange={this.onChange}
            />
          </Container>
        </div>

        {allPosts ? allPosts.map((post, index) => {
          return (
            <Card
              className='card'
              centered={true}
              key={index}
              onClick={this.onPostClick.bind(this, post.id)}
            >
              <Card.Content>
                <Card.Header>{post.user.username}</Card.Header>
                <Card.Meta>{post.stock.name} {`(${post.stock.symbol})`}</Card.Meta>
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
      id
      created_at
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
