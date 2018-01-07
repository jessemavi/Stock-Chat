const db = require('../db/index');

module.exports = {
  Comment: {
    likes: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from likes where comment_id = ${obj.id}`);
      // console.log(query.rows);
      return query.rows;
    },
    user: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from users where id = ${obj.user_id}`);
      return query.rows[0];
    },
    post: async (obj) => {
      const query = await db.query(`select * from posts where id = ${obj.post_id}`);
      return query.rows[0];
    }
  },

  Query: {
    allComments: async (_, args) => {
      const query = await db.query(`select * from comments where post_id = ${args.post_id}`);
      return query.rows;
    }
  },

  Mutation: {
    createComment: async (_, args, { user }) => {
      console.log('args in createComment', args);
      try {
        // escape apostrophes before inserting into db 
        const cleanedContent = args.content.replace(new RegExp("'", 'g'), "''");
        const query = await db.query(`
          insert into comments (content, post_id, user_id) 
          values ('${cleanedContent}', ${args.post_id}, ${user.user})
          returning *
        `);
        console.log('query row in createComment', query.rows[0]);
        return {
          commentCreated: true,
          comment: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          commentCreated: false,
          error: err
        };
      }
    },

    deleteComment: async (_, args, { user }) => {
      try {
        console.log('args', args);
        const query = await db.query(`delete from comments where id = ${args.comment_id} and user_id = ${args.user_id} returning *`);
        return {
          commentDeleted: true,
          comment: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          commentDeleted: false,
          error: err
        };
      }
    }
  }
};