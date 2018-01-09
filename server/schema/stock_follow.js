module.exports = `
  type StockFollow {
    id: Int!
    stock: Stock!
    user: User!
  }

  type Query {
    allStocksForUser(user_id: Int!): [Stock!]!
    allUsersForStock(stock_id: Int!): [User!]!
  }

  type Mutation {
    followStock(stock_id: Int!, user_id: Int!): Boolean!
    unfollowStock(stock_id: Int!, user_id: Int!): Boolean!
  }
`;
