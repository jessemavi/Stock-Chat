const db = require('../db/index');

module.exports = {
  Query: {
    allComments: async (_, args) => {
      const query = await db.query(`select * from comments where post_id = ${args.post_id}`);
      return query.rows;
    }
  },

  Mutation: {
    createComment: async (_, args) => {
      try {
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