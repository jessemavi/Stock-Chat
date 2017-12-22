module.exports = `
  type Like {
    id: Int!
    post: Post
    comment: Comment
    user: User!
  }

  type Query {
    allLikes(post_id: Int, comment_id: Int): [Like!]!
  }

  type Mutation {
    createLike(post_id: Int, comment_id: Int, user_id: Int!): Boolean!
    removeLike(post_id: Int, comment_id: Int, user_id: Int!): Boolean!
  }
`;