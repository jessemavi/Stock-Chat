const db = require('../db/index');
const requiresAuth = require('../permissions');

module.exports = {
  Post: {
    stock: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from stocks where id = ${obj.stock_id}`)
      return query.rows[0];
    },
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
    allPosts: async () => {
      const query = await db.query(`select * from posts`);
      return query.rows;
    },
    allPostsForStock: async (_, args) => {
      console.log('args in allPostsForStock', args);
      const query = await db.query(`select * from posts where stock_id = ${args.stock_id}`);
      return query.rows;
    },
    allPostsForUser: async (_, args, { user }) => {
      console.log('user in allPostsForUser query', user);
      const query = await db.query(`select * from posts where user_id = ${user.user}`);
      return query.rows;
    },
    post: async (_, args) => {
      const query = await db.query(`select * from posts where id = ${args.post_id}`);
      return query.rows[0];
    }
  },

  Mutation: {
    createPost: requiresAuth.createResolver(async (_, args, { user }) => {
      try {
        // console.log('args in createPost mutation', args);
        // console.log('user', user);
        // escape apostrophes before inserting into db
        const cleanedContent = args.content.replace(new RegExp("'", 'g'), "''");
        const query = await db.query(`
          insert into posts (content, stock_id, user_id)
          values ('${cleanedContent}', ${args.stock_id}, ${user.user}) returning *
        `);
        console.log('query row', query.rows[0]);
        return {
          postCreated: true,
          post: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          postCreated: false,
          error: err
        };
      }
    }),

    deletePost: async (_, args, { user }) => {
      try {
        console.log('args', args);
        await db.query(`delete from posts where id = ${args.post_id} and user_id = ${user.user}`);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};