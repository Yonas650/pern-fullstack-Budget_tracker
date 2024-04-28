// src/components/ChartPage.jsx

import React from 'react';
import { TransactionChart } from './TransactionChart';

const ChartPage = ({ transactions }) => {
  return (
    <div>
      <h1>Transaction Overview</h1>
      <TransactionChart transactions={transactions} />
    </div>
  );
};

export default ChartPage;
