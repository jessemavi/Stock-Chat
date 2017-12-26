const db = require('./db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

module.exports = login;
