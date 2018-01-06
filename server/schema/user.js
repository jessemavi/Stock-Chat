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
    getUser(user_id: Int!): User!
    allUsers: [User!]!
  }

  type SignupResponse {
    userCreated: Boolean!
    token: String
    user_id: Int
    error: String
  }

  type LoginResponse {
    userLoggedIn: Boolean!
    token: String
    user_id: Int
    error: String
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): SignupResponse!
    loginUser(email: String!, password: String!): LoginResponse
  }
`;