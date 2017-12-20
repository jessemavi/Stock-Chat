const db = require('../db/index');

module.exports = {
  Query: {
    allUsers: async () => {
      const query = await db.query(`select * from users`);
      return query.rows;
    }
  },

  Mutation: {
    createUser: async (_, data) => {
      await db.query(`
        insert into users (username, email, password) 
        values ('${data.username}', '${data.email}', '${data.password}')
      `);
      const query = await db.query(`
        select id, username, email, password from users order by id desc limit 1
      `);
      return query.rows[0];
    },
  }
};