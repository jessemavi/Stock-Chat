module.exports = `
  type StockFollow {
    id: Int!
    stock: Stock!
    user: User!
  }

  type Query {
    allStocksForUser(user_id: Int!): [Stock!]!
    userFollowsStock(stock_id: Int!, user_id: Int!): Boolean!
  }

  type FollowStockResponse {
    stockFollowed: Boolean!
    stockFollow: StockFollow
    error: String
  }

  type Mutation {
    followStock(stock_id: Int!, user_id: Int!): FollowStockResponse!
    unfollowStock(stock_id: Int!, user_id: Int!): Boolean!
  }
`;
