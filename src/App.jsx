import React, { useState, useEffect } from 'react';
import './app.css'; 
import { Login, Register, Dashboard, TransactionForm } from './components';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/transactions?userId=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`  //use the token for authorization if your API requires it
        }
      })
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(err => console.error('Error fetching transactions:', err));
    }
  }, [user]); //dependency on user ensures this runs when the user state changes
  
  

  const handleLogin = (username, password) => {
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === "Login successful") {
        //assuming data.user includes the user ID and token
        setUser({
          username: username,
          id: data.user.id,
          token: data.user.token
        });
        localStorage.setItem('user', JSON.stringify({
          username: username,
          id: data.user.id,
          token: data.user.token
        })); //store user info in local storage
      } else {
        alert('Login failed: ' + data.error);
      }
    })
    .catch(err => {
      console.error('Login error:', err);
    });
  };
  
  
  const handleRegister = (username, email, password) => {
    fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        alert('Registration successful, please log in.');
      } else {
        alert('Registration failed: ' + data.error);
      }
    })
    .catch(err => {
      console.error('Registration error:', err);
    });
  };

  const handleAddTransaction = (newTransaction) => {
    if (!user || !user.id) {
      alert('User ID missing');
      console.error('User ID missing');
      return;  //validate user ID presence
    }
  
    const transactionWithUser = { ...newTransaction, user_id: user.id };
  
    fetch('http://localhost:3001/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionWithUser)
    })
    .then(response => response.json())
    .then(addedTransaction => {
      if (addedTransaction.error) {
        throw new Error(addedTransaction.error);
      }
      setTransactions(prev => [...prev, addedTransaction]);
    })
    .catch(err => {
      console.error('Error adding transaction:', err);
      alert('Error adding transaction: ' + err.message);
    });
  };
  
  

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const handleDeleteTransaction = (id) => {
    fetch(`http://localhost:3001/api/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        //include authorization header if necessary
        'Authorization': `Bearer ${user.token}`
      }
    })
    .then(response => response.json())
    .then(() => {
      setTransactions(transactions.filter(tx => tx.id !== id));
    })
    .catch(err => console.error('Error deleting transaction:', err));
  };


  return (
    <div className="container-fluid mt-5">
     <h1 className="text-center header-title">Visual Budget Tracker</h1>
      {!user ? (
        <>
          <Register onRegister={handleRegister} />
          <Login onLogin={handleLogin} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <Dashboard transactions={transactions} onDelete={handleDeleteTransaction} />
        </>
      )}
    </div>
  );
};


export default App;
