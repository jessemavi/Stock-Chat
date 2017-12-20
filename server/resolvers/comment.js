const db = require('../db/index');

module.exports = {
  Query: {
    allComments: async (_, args) => {
      const query = await db.query(`select * from comments where post_id = ${args.post_id}`);
      return query.rows;
    }
  }
};