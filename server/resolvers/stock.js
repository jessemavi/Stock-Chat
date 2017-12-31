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
    stock: async (_, args) => {
      console.log('args in stock query', args);
      const query = await db.query(`select * from stocks where id = ${args.stock_id}`);
      return query.rows[0];
    },
    allStocks: async () => {
      const query = await db.query(`select * from stocks`);
      // console.log(query.rows);
      return query.rows;
    }
  }
};