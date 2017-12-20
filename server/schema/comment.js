module.exports = `
  type Comment {
    id: Int!
    content: String!
    post: Post!
    user: User!
    likes: [Like!]!
  }

  type Query {
    allComments(post_id: Int!): [Comment!]!
  }
`;