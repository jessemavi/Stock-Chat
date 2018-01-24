const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const secret = 'stock-chat-12**34';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();
app.use(cors());

// authentication middleware
const verifyUser = async (req, res, next) => {
  // console.log('req', req);
  console.log('req headers authorization:', req.headers.authorization);

  let token;
  
  if(req.headers.authorization) {
    token = req.headers.authorization.slice(7);
  }
  if(token) {
    try {
      // verify jwt token
      const user = jwt.verify(token, secret);
      console.log('user in verifyUser middleware', user);
      req.user = user;

    } catch(err) {
      console.log('error in verifyUser middleware', err);
      return err;
    }
  }
  next()
};

app.use(verifyUser);

app.use(
  '/graphql', 
  bodyParser.json(), 
  graphqlExpress(req => ({ 
    schema, 
    context: {
      user: req.user,
      secret
    } 
  }))
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(4000, () => {
  console.log('Go to http://localhost:4000/graphiql to run queries!');
});
