const db = require('../db/index');
const auth = require('../auth');

module.exports = {

  User: {
    posts: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from posts where user_id = ${obj.id}`);
      return query.rows;
    },
    comments: async (obj) => {
      const query = await db.query(`select * from comments where user_id = ${obj.id}`);
      return query.rows;
    },
    likes: async (obj) => {
      const query = await db.query(`select * from likes where user_id = ${obj.id}`);
      return query.rows;
    }
  },

  Query: {
    getUser: async (_, args) => {
      const query = await db.query(`select * from users where id = ${args.id}`);
      return query.rows[0];
    },
    allUsers: async () => {
      const query = await db.query(`select * from users`);
      return query.rows;
    }
  },

  Mutation: {
    createUser: async (_, args, { secret }) => {
      // console.log('args in createUser mutation', args);
      return auth.signUp(args.username, args.email, args.password, secret);
    },

    loginUser: async (_, args, { secret }) => {
      // console.log('args in loginUser mutation', args);
      return auth.login(args.email, args.password, secret);
    }
  }

};
