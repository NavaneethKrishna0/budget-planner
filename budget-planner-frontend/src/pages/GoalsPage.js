import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalsPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const GoalsPage = () => {
    const [goals, setGoals] = useState([]);
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = () => {
        axios.get(`${API_BASE_URL}/goals`).then(res => setGoals(res.data));
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        const newGoal = { name, targetAmount: parseFloat(targetAmount), currentAmount: 0 };
        axios.post(`${API_BASE_URL}/goals`, newGoal).then(() => {
            fetchGoals();
            setName('');
            setTargetAmount('');
        });
    };
    
    const handleContribute = (goalId) => {
        const amountStr = window.prompt("Enter amount to contribute:");
        if (amountStr) {
            const amount = parseFloat(amountStr);
            if (!isNaN(amount) && amount > 0) {
                axios.post(`${API_BASE_URL}/goals/${goalId}/contribute`, { amount })
                    .then(() => {
                        fetchGoals(); // Refresh goals to show new progress
                    })
                    .catch(error => console.error("Error contributing to goal:", error));
            } else {
                alert("Please enter a valid positive number.");
            }
        }
    };

    return (
        <div className="goals-page">
            <h1>Savings Goals</h1>
            <form onSubmit={handleAddGoal} className="goal-form">
                <h3>Set a New Goal</h3>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Goal Name (e.g., Vacation)" required />
                <input type="number" min="1" step="any" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Target Amount" required />
                <button type="submit">Add Goal</button>
            </form>

            <div className="goals-list">
                {goals.map(goal => (
                    <div key={goal.id} className="goal-item">
                        <div className="goal-info">
                            <h4>{goal.name}</h4>
                            <p>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</p>
                        </div>
                        <progress value={goal.currentAmount} max={goal.targetAmount}></progress>
                        <button className="contribute-btn" onClick={() => handleContribute(goal.id)}>
                            Add Funds
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsPage;