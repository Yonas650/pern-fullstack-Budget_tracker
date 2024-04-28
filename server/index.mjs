import express from 'express';
import cors from 'cors';
import { pool, getUserByUsername, createUser, addTransaction } from './db.mjs';

import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

//root endpoint
app.get('/', (req, res) => {
  res.send('Budget Tracker API is running');
});

//get all transactions
app.get('/api/transactions', async (req, res) => {
  const userId = req.query.userId;  //get user ID from query parameter
  try {
    const { rows } = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//add a transaction
app.post('/api/transactions', async (req, res) => {
  console.log("Received transaction data:", req.body);  //confirm data received

  const { description, amount, date, category, user_id } = req.body;

  if (!user_id) {
    console.error('User ID not provided in request:', req.body);
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO transactions (description, amount, date, category, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [description, amount, date, category, user_id]
    );
    console.log("Transaction added:", rows[0]); //log the transaction added
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ error: "Failed to add transaction.", details: err.detail });
  }
});


//register new user
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const usernameLower = username.toLowerCase(); //ensure username is in lowercase

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [usernameLower, email, hashedPassword]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

//login user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const usernameLower = username.toLowerCase();

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [usernameLower]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      //send back user id and other needed user information
      res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
