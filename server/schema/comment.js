module.exports = `
  type Comment {
    id: Int!
    content: String!
    post: Post!
    user: User!
  }
`;