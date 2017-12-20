const db = require('../db/index');

module.exports = {
  Post: {
    user: async (obj) => {
      // query for user from obj user_id
      const query = await db.query(`select * from users where id = ${obj.user_id}`)
      return query.rows[0];
    }
  },

  Query: {
    allPosts: async (_, args) => {
      const query = await db.query(`
        select * from posts 
        where stock_id = ${args.stock_id}
      `);
      return query.rows;
    }
  },

  Mutation: {
    createPost: async (_, args) => {
      try {
        await db.query(`
          insert into posts (content, stock_id, user_id)
          values ('${args.content}', ${args.stock_id}, ${args.user_id})
        `);
        const query = await db.query(`select id, content, stock_id, user_id from posts order by id desc limit 1`);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};