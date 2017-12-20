const db = require('../db/index');

module.exports = {
  Query: {
    allStocks: async () => {
      const query = await db.query(`select * from stocks`);
      console.log(query.rows);
      return query.rows;
    }
  }
};