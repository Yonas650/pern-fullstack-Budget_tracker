import React from 'react';
import Chart from 'react-google-charts';

export const TransactionChart = ({ transactions }) => {
    //prepare data for Google Charts
    const chartData = [
        ['Transaction', 'Amount'], //column names
        ...transactions.map(tx => [tx.description, Number(tx.amount)]),
    ];

    return (
        <div>
            <h2>Transaction Overview</h2>
            <Chart
                width={'100%'}
                height={'400px'}
                chartType="BarChart"
                loader={<div>Loading Chart...</div>}
                data={chartData}
                options={{
                    title: 'Transactions Amount',
                    chartArea: { width: '50%' },
                    hAxis: {
                        title: 'Total Amount',
                        minValue: 0,
                    },
                    vAxis: {
                        title: 'Transaction',
                    },
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </div>
    );
};
