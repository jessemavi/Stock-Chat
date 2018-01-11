const db = require('../db/index');

module.exports = {
  StockFollow: {
    user: async (obj) => {
      const query = await db.query(`select * from users where id = ${obj.user_id}`);
      return query.rows[0];
    }
  },

  Query: {
    allStocksForUser: async (_, args, { user }) => {
      const query = await db.query(`select * from stocks_follow where user_id = ${args.user_id}`);
      return query.rows[0];
    },

    userFollowsStock: async (_, args, { user }) => {
      const query = await db.query(`select * from stocks_follow where stock_id = ${args.stock_id} and user_id = ${args.user_id}`);
      return query.rows[0] !== undefined;
    }
  },

  Mutation: {
    followStock: async (_, args, { user }) => {
      try {
        const query = await db.query(`insert into stocks_follow (stock_id, user_id) values (${args.stock_id}, ${args.user_id}) returning *`);
        return {
          stockFollowed: true,
          stockFollow: query.rows[0]
        };
      } catch(err) {
        console.log(err);
        return {
          stockFollowed: false,
          error: err
        };
      }
    },

    unfollowStock: async (_, args, { user }) => {
      try {
        const query = await db.query(`delete from stocks_follow where stock_id = ${args.stock_id} and user_id = ${args.user_id}`);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    }
  }
};