import React, { useState } from 'react';
import { TransactionChart } from './TransactionChart';
//login component
export const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();
      onLogin(username, password);
  };

  return (
      <div className="card p-4 mt-5 mx-auto" style={{maxWidth: '400px'}}>
          <h2 className="text-center">Login</h2>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
              </div>
              <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </div>
              <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
      </div>
  );
};

//register component
export const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
      e.preventDefault();
      onRegister(username, email, password);
  };

  return (
      <div className="card p-4 mt-5 mx-auto" style={{maxWidth: '400px'}}>
          <h2 className="text-center">Register</h2>
          <form onSubmit={handleSubmit}>
              <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username:</label>
                  <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                  />
              </div>
              <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
              </div>
              <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password:</label>
                  <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </div>
              <button type="submit" className="btn btn-success w-100">Register</button>
          </form>
      </div>
  );
};

//dashboard component
export const Dashboard = ({ transactions, onDelete }) => {
  return (
    <div>
      <TransactionChart transactions={transactions} />
      <div className="table-responsive">
        <table className="table table-hover mt-4">
          <thead className="table-dark">
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Action</th> {/*add a header for the delete column */}
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id}>
                <td>{tx.description}</td>
                <td>${Number(tx.amount).toFixed(2)}</td>
                <td>{new Date(tx.date).toLocaleDateString()}</td>
                <td>{tx.category}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => onDelete(tx.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};



export const TransactionForm = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTransaction({ description, amount: parseFloat(amount), date, category });
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().slice(0, 10));
    setCategory('');
  };

  return (
    <div>
      <h2>Add New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description" 
          required 
        />
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Amount" 
          required 
        />
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          placeholder="Category" 
          required 
        />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
};