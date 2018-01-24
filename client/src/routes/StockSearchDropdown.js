import React, { Component} from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown, Container } from 'semantic-ui-react';

class StockSearchDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    console.log('props in StockSearchDropdown', props)
  }

  onChange = async (event, { value }) => {
    console.log('handleChange');
    await this.setState({ value })
    // stock is selected here -> move to stock posts page with posts for the stock selected
    console.log('value', value);
    this.props.propsFromMainComponent.history.push(`/posts/${value}`);
  }

  render() {
    const { value } = this.state
    const stateOptions = []

    if(this.props.allStocksQuery && this.props.allStocksQuery.allStocks) {
      this.props.allStocksQuery.allStocks.forEach((stock, index) => {
        stateOptions.push({key: index, value: stock.id, text: `${stock.name} (${stock.symbol})`})
      })
    }

    return (
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
    )
  }
}

const allStocksQuery = gql`
  {
    allStocks {
      id
      name
      symbol
    }
  }
`;

export default graphql(allStocksQuery, { name: 'allStocksQuery' })(StockSearchDropdown);
