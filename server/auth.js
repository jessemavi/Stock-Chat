const db = require('./db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (username, email, password, secret) => {
  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // insert into db
    const query = await db.query(`
      insert into users (username, email, password) 
      values ('${username}', '${email}', '${hashedPassword}')
      returning id, username, email
    `);
    // console.log('query', query);
    // console.log('query.rows', query.rows[0]);
    const user = query.rows[0];

    // create jwt to send back in response
    const token = await jwt.sign({user: user.id}, secret, {expiresIn: '4hr'});

    return {
      userCreated: true,
      token: token,
    }
  } catch(err) {
    console.log('err', err);
    console.log('err.detail', err.detail);
    return {
      userCreated: false,
      error: err.detail
    }
  }
}

const login = async (email, password, secret) => {
  // find user in db
  const query = await db.query(`select * from users where email = '${email}'`);
  const user = query.rows[0];
  // console.log('user in login function', user);

  // if email does not exist in db, return error
  if(!user) {
    return {
      userLoggedIn: false,
      error: 'email does not exist'
    };
  }

  // validate password passed in with hashed password in db
  const validPassword = await bcrypt.compare(password, user.password);
  if(!validPassword) {
    return {
      userLoggedIn: false,
      error: 'wrong password'
    };
  }

  // create jwt to send back in response
  const token = await jwt.sign({user: user.id}, secret, {expiresIn: '4hr'});

  return {
    userLoggedIn: true,
    token: token
  }
};

module.exports = {
  signUp: signUp, 
  login: login
};
