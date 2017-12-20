const db = require('../db/index');

module.exports = {
  Post: {
    user: async (obj) => {
      // query for user from obj user_id
      const query = await db.query(`select * from users where id = ${obj.user_id}`);
      return query.rows[0];
    },
    comments: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from comments where post_id = ${obj.id}`);
      return query.rows;
    },
    likes: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from likes where post_id = ${obj.id}`);
      return query.rows;
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
        // escape apostrophes before inserting into db
        const cleanedContent = args.content.replace(new RegExp("'", 'g'), "''");
        await db.query(`
          insert into posts (content, stock_id, user_id)
          values ('${cleanedContent}', ${args.stock_id}, ${args.user_id})
        `);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};