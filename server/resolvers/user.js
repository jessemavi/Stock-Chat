const db = require('../db/index');
const bcrypt = require('bcrypt');

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
        await db.query(`
          insert into users (username, email, password) 
          values ('${args.username}', '${args.email}', '${hashedPassword}')
        `);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },
  }
};