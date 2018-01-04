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

  type CreateCommentResponse {
    commentCreated: Boolean!
    comment: Comment
    error: String
  }

  type Mutation {
    createComment(content: String!, post_id: Int!): CreateCommentResponse!
    removeComment(comment_id: Int!, user_id: Int!): Boolean!
  }
`;