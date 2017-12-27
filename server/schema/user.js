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
    getUser(id: Int!): User!
    allUsers: [User!]!
  }

  type SignupResponse {
    userCreated: Boolean!
    token: String
    error: String
  }

  type LoginResponse {
    userLoggedIn: Boolean!
    token: String
    error: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): SignupResponse!
    loginUser(email: String!, password: String!): LoginResponse
  }
`;