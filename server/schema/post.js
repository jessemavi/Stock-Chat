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
    allPostsForUser: [Post!]!
    post(post_id: Int!) : Post!
  }

  type CreatePostResponse {
    postCreated: Boolean!
    post: Post
    error: String
  }

  type Mutation {
    createPost(content: String!, stock_id: Int!): CreatePostResponse!
    deletePost(post_id: Int!, user_id: Int): Boolean!
  }
`;