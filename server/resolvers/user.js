const db = require('../db/index');
const bcrypt = require('bcrypt');
const login = require('../auth');

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
    createUser: async (_, args) => {
      try {
        const hashedPassword = await bcrypt.hash(args.password, 12);
        const query = await db.query(`
          insert into users (username, email, password) 
          values ('${args.username}', '${args.email}', '${hashedPassword}')
          returning id, username, email
        `);
        console.log('query.rows', query.rows[0]);
        return {
          userCreated: true,
          user: query.rows[0],
          error: null
        }
      } catch(err) {
        console.log('err', err);
        console.log('err.detail', err.detail);
        return {
          userCreated: false,
          user: null,
          error: err.detail
        }
      }
    },

    loginUser: async (_, args, { secret }) => {
      // console.log('args', args);
      try {
        return login(args.email, args.password, secret);
      } catch(err) {
        return {
          userLoggedIn: false,
          token: null,
          error: err
        }
      }
    }
  }

};
