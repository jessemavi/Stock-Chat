const db = require('../db/index');

module.exports = {
  Comment: {
    likes: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from likes where comment_id = ${obj.id}`);
      // console.log(query.rows);
      return query.rows;
    }
  },

  Query: {
    allComments: async (_, args) => {
      const query = await db.query(`select * from comments where post_id = ${args.post_id}`);
      return query.rows;
    }
  },

  Mutation: {
    createComment: async (_, args) => {
      try {
        // escape apostrophes before inserting into db 
        const cleanedContent = args.content.replace(new RegExp("'", 'g'), "''");
        await db.query(`
          insert into comments (content, post_id, user_id) 
          values ('${cleanedContent}', ${args.post_id}, ${args.user_id})
        `);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};