const db = require('../db/index');

module.exports = {
  Like: {
    user: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from users where id = ${obj.user_id}`);
      return query.rows[0];
    },
    post: async (obj) => {
      // should have post_id in obj
      const query = await db.query(`select * from posts where id = ${obj.post_id}`);
      // console.log('post', query.rows[0]);
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
    createLike: async (_, args, { user }) => {
      console.log('args', args);
      console.log('user', user);
      try {
        let type;
        let valueToInsert;
        if(args.post_id && !args.comment_id) {
          type = 'post';
          valueToInsert = args.post_id;
        } else if(args.comment_id) {
          type = 'comment';
          valueToInsert = args.comment_id;
        }
        const query = await db.query(`insert into likes (${type}_id, user_id) values (${valueToInsert}, ${user.user}) returning *`);
        console.log('query row', query.rows[0]);
        if(query.rows[0].comment_id && args.post_id) {
          query.rows[0].post_id = args.post_id
        }
        return {
          likeCreated: true,
          likeType: type,
          like: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          likeCreated: false,
          error: err
        };
      }
    },

    removeLike : async (_, args, { user }) => {
      try {
        // console.log('args', args);
        let type;
        let argsValue;
        if(args.post_id && !args.comment_id) {
          type = 'post';
          argsValue = args.post_id;
        } else if(args.comment_id) {
          type = 'comment';
          argsValue = args.comment_id;
        }

        const query = await db.query(`delete from likes where ${type}_id = ${argsValue} and user_id = ${user.user} returning *`);

        if(query.rows[0].comment_id && args.post_id) {
          query.rows[0].post_id = args.post_id
        }
        return {
          likeRemoved: true,
          like: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          likeRemoved: false,
          error: query.rows[0]
        };
      }
    }
  }
};