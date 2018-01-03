module.exports = `
  type Post {
    id: Int!
    content: String!
    stock: Stock!
    user: User!
    comments: [Comment!]!
    likes: [Like!]!
  }

  type Query {
    allPosts: [Post!]!
    allPostsForStock(stock_id: Int!): [Post!]!
    post(post_id: Int!) : Post!
  }

  type Mutation {
    createPost(content: String!, stock_id: Int!): Boolean!
    removePost(post_id: Int!, user_id: Int!): Boolean!
  }
`;