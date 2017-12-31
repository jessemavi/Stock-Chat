module.exports = `
  type Stock {
    id: Int!
    symbol: String!
    name: String!
    posts: [Post!]!
  }

  type Query {
    allStocks: [Stock!]!
    stock(stock_id: Int!): Stock!
  }
`;