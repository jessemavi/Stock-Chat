module.exports = `
  type Comment {
    id: Int!
    content: String!
    created_at: String!
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

  type DeleteCommentResponse {
    commentDeleted: Boolean!
    comment: Comment
    error: String
  }

  type Mutation {
    createComment(content: String!, post_id: Int!): CreateCommentResponse!
    deleteComment(comment_id: Int!, user_id: Int!): DeleteCommentResponse!
  }
`;