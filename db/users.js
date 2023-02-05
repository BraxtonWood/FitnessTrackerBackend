const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  //console.log("createUser username:", username, "password:", password)
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {rows:[createdUser]} = await client.query(`
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, hashedPassword]);
    delete createdUser.password;
    return createdUser;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  //console.log("getUser username:", username, "password:", password);
  try {
    const {rows:[user]} = await client.query(`
      SELECT * FROM users
      WHERE username=$1;
    `,[username]);
    console.log("user", user);
    const hashedPassword = user.password;
    let passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      return false;
      // throw {
      //   name: "PasswordIncorrectError",
      //   message: "Password is incorrect for this user, please try again"
      // }
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  //console.log("getUserById id:", userId);
  try {
    const {rows:[user]} = await client.query(`
      SELECT * FROM users
      WHERE id=$1;
      `, [userId]);
      delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  //console.log("getUserByUsername username:", userName);
  try {
    const {rows:[user]} = await client.query(`
      SELECT * FROM users
      WHERE username=$1;
    `,[userName]);
  return user;
} catch (error) {
  throw error;
}
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
