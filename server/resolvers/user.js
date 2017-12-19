const db = require('../db/index');

module.exports = {
  Query: {
    allUsers: async () => {
      const query = await db.query(`select * from users`);
      console.log(query.rows);
      return query.rows;
    } 
  },

  Mutation: {
    createUser: async (_, data) => {
      // console.log('data', data);
      await db.query(`
        insert into users (username, email, password) 
        values ('${data.username}', '${data.email}', '${data.password}')
      `);
      const query = await db.query(`
        select id, username, email, password from users order by id desc limit 1
      `);
      console.log(query.rows[0]);
      return query.rows[0];
    }
  }
};