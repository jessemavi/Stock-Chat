module.exports = `
  type User {
    id: Int!
    username: String!
    email: String!
    password: String!
    posts: [Post!]
    comments: [Comment!]
    likes: [Like!]
  }

  type Query {
    allUsers: [User!]!
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): User
  }
`;