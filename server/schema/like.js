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

  type CreateLikeResponse {
    likeCreated: Boolean!
    likeType: String
    like: Like
    error: String
  }

  type RemoveLikeResponse {
    likeRemoved: Boolean!
    like: Like
    error: String
  }

  type Mutation {
    createLike(post_id: Int, comment_id: Int): CreateLikeResponse!
    removeLike(post_id: Int, comment_id: Int): RemoveLikeResponse!
  }
`;