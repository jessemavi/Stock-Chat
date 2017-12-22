const db = require('../db/index');

module.exports = {
  Like: {
    user: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from users where id = ${obj.user_id}`);
      return query.rows[0];
    }
  },

  Query: {
    allLikes: async (_, args) => {
      console.log('args', args);
      // need to see if getting likes for a post or a comment
      let type;
      let valueToQuery;
      if(args.post_id) {
        type = 'post';
        valueToQuery = args.post_id;
      } else if(args.comment_id) {
        type = 'comment';
        valueToQuery = args.comment_id;
      }

      const query = await db.query(`select * from likes where ${type}_id = ${valueToQuery}`);
      return query.rows;
    }
  },

  Mutation: {
    createLike: async (_, args) => {
      try {
        // console.log('args', args);
        let type;
        let valueToInsert;
        if(args.post_id) {
          type = 'post';
          valueToInsert = args.post_id;
        } else if(args.comment_id) {
          type = 'comment';
          valueToInsert = args.comment_id;
        }
        await db.query(`insert into likes (${type}_id, user_id) values (${valueToInsert}, ${args.user_id})`);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },

    removeLike : async (_, args) => {
      try {
        console.log('args', args);
        if(args.post_id) {
          await db.query(`delete from likes where post_id = ${args.post_id} and user_id = ${args.user_id}`);
        } else if(args.comment_id) {
          await db.query(`delete from likes where comment_id = ${args.comment_id} and user_id = ${args.user_id}`);
        }
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};