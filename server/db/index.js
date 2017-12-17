// connect to postgres db
const { Client } = require('pg');
const connectionString = 'postgresql://localhost:5432/stock_chat';

const client = new Client({
  connectionString: connectionString
});

const connectToDB = async () => {
  try {
    await client.connect();
    // const query = await client.query('select * from users');
    console.log('Connected to PostgreSQL stock_chat db');
  } catch(err) {
    console.log(err);
  }
};

module.exports = connectToDB;
