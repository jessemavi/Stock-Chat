const db = require('../db/index');

module.exports = {
  Query: {
    allUsers: async () => {
      const query = await db.query(`select * from users`);
      return query.rows;
    }
  },

  Mutation: {
    createUser: async (_, args) => {
      try {
        await db.query(`
          insert into users (username, email, password) 
          values ('${args.username}', '${args.email}', '${args.password}')
        `);
        return true;
      } catch(err) {
        console.log(err);
        return false;
      }
    },
  }
};