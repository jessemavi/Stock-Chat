const db = require('../db/index');

module.exports = {
  Stock: {
    posts: async (obj) => {
      // console.log('obj', obj);
      const query = await db.query(`select * from posts where stock_id = ${obj.id}`);
      return query.rows;
    }
  },

  Query: {
    allStocks: async () => {
      const query = await db.query(`select * from stocks`);
      // console.log(query.rows);
      return query.rows;
    }
  }
};