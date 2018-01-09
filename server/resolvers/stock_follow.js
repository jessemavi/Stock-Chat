const db = require('../db/index');

module.exports = {
  StockFollow: {

  },

  Query: {
    allStocksForUser: async (_, args, { user }) => {
      const query = await db.query(`select * from stocks_follow where user_id = ${args.user_id}`);
      return query.rows[0];
    },

    allUsersForStock: async (_, args, { user }) => {
      const query = await db.query(`select * from stocks_follow where stock_id = ${args.stock_id}`);
      return query.rows[0];
    }
  },

  Mutation: {
    followStock: async (_, args, { user }) => {
      try {
        const query = await db.query(`insert into stocks_follow (stock_id, user_id) values (${args.stock_id}, ${args.user_id})`);
        return true;
      } catch(err) {
        console.log(err);
        return false;
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