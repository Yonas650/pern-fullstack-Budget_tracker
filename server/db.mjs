import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'budget_tracker',
  password: 'password',
  port: 5432,
});

//function to fetch a user by username
const getUserByUsername = async (username) => {
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username.trim().toLowerCase()];
    const { rows } = await pool.query(query, values);
    console.log('Query executed:', query, 'Values:', values);
    console.log('Query result:', rows);
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error('Error querying user by username:', username, err);
    throw err;
  }
};


//function to create a new user
const createUser = async (username, email, passwordHash) => {
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, passwordHash]
  );
  return rows[0];
};
//function to add a new transaction
const addTransaction = async (description, amount, date, category, user_id) => {
  try {
    const { rows } = await pool.query(
      'INSERT INTO transactions (description, amount, date, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [description, amount, date, category, user_id]
    );
    return rows[0];
  } catch (err) {
    console.error('Error adding transaction:', err);
    throw err;
  }
};

export { pool, getUserByUsername, createUser, addTransaction };



