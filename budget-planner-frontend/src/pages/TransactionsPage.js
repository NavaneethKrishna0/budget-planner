import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import axios from 'axios';
import './TransactionsPage.css'; // For styling the list

const API_URL = 'http://localhost:8081/api/transactions';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(API_URL);
            setTransactions(response.data);
            setError('');
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setError('Could not connect to the server. Please ensure the backend is running.');
        }
    };

    const handleAddTransaction = async (transaction) => {
        try {
            await axios.post(API_URL, transaction);
            fetchTransactions(); // Refresh the list after adding
        } catch (error) {
            console.error("Error adding transaction:", error);
            setError('Failed to add transaction. Please try again.');
        }
    };

    return (
        <div>
            <h1>Income & Expenses</h1>
            <TransactionForm onAddTransaction={handleAddTransaction} />
            
            <h2>Recent Transactions</h2>
            {error && <p className="error-message">{error}</p>}
            <ul className="transaction-list">
                {transactions.map(t => (
                    <li key={t.id} className={`transaction-item ${t.type}`}>
                        <span>{t.date}</span>
                        <span>{t.description}</span>
                        <span className="amount">${t.amount.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionsPage;