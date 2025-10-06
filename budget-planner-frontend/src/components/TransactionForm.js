import React, { useState } from 'react';
import './TransactionForm.css';

const TransactionForm = ({ onAddTransaction }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Food');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!description || !amount) {
            alert("Please fill out all fields.");
            return;
        }

        const newTransaction = {
            description,
            amount: parseFloat(amount),
            type,
            category: type === 'income' ? 'Income' : category,
            date: new Date().toISOString().slice(0, 10)
        };

        onAddTransaction(newTransaction);

        setDescription('');
        setAmount('');
    };
    
    const expenseCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <h3>Add New Transaction</h3>
            <div className="form-controls">
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="e.g., Coffee" 
                    required 
                />
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    placeholder="Amount" 
                    min="0.01"
                    step="0.01"
                    required 
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
                
                {type === 'expense' && (
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                )}

                <button type="submit">Add</button>
            </div>
        </form>
    );
};

export default TransactionForm;