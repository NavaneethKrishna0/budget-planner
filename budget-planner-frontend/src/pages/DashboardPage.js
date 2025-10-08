import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './DashboardPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Use the environment variable for the production URL, with a fallback for local development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const DashboardPage = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topGoal, setTopGoal] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data in parallel for faster loading
                const [summaryRes, transactionsRes, goalsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/transactions/summary`),
                    axios.get(`${API_BASE_URL}/transactions/recent`),
                    axios.get(`${API_BASE_URL}/goals`)
                ]);

                if (summaryRes.data) setSummary(summaryRes.data);
                if (transactionsRes.data) setRecentTransactions(transactionsRes.data);
                
                // Calculate and set the top goal
                if (goalsRes.data && goalsRes.data.length > 0) {
                    const sortedGoals = goalsRes.data.sort((a, b) => 
                        (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
                    );
                    setTopGoal(sortedGoals[0]);
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const doughnutData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [summary.totalIncome, summary.totalExpenses],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
        }]
    };
    
    const doughnutOptions = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            }
        }
    };

    const getGoalProgress = () => {
        if (!topGoal || topGoal.targetAmount === 0) return 0;
        return (topGoal.currentAmount / topGoal.targetAmount) * 100;
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <div className="dashboard-grid">
                
                {/* Summary Cards */}
                <div className="summary-card card-income">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="card-content">
                        <p>Total Income</p>
                        <h3>${summary.totalIncome.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="summary-card card-expenses">
                    <div className="card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    </div>
                    <div className="card-content">
                        <p>Total Expenses</p>
                        <h3>${summary.totalExpenses.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="summary-card card-balance">
                    <div className="card-icon">
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                    <div className="card-content">
                        <p>Balance</p>
                        <h3>${summary.balance.toFixed(2)}</h3>
                    </div>
                </div>

                {/* Main Chart */}
                <div className="main-chart">
                    <h3>Spending Overview</h3>
                    <div className="doughnut-wrapper">
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                        <div className="chart-center-text">
                            <span>Balance</span>
                            <strong>${summary.balance.toFixed(2)}</strong>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity">
                    <h3>Recent Transactions</h3>
                    <ul>
                        {recentTransactions.map(t => (
                            <li key={t.id} className={t.type}>
                                <div className="transaction-details">
                                    <strong>{t.description}</strong>
                                    <span>{t.category}</span>
                                </div>
                                <strong className="transaction-amount">
                                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                </strong>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Goals Overview */}
                <div className="goals-overview">
                    <h3>Top Goal Progress</h3>
                    {topGoal ? (
                        <div className="goal-content">
                            <strong>{topGoal.name}</strong>
                            <p>${topGoal.currentAmount.toFixed(2)} / ${topGoal.targetAmount.toFixed(2)}</p>
                            <div className="progress-bar-container">
                                <div className="progress-bar" style={{width: `${getGoalProgress()}%`}}></div>
                            </div>
                            <span>{getGoalProgress().toFixed(0)}% Complete</span>
                        </div>
                    ) : (
                        <p>No goals set yet. Go to the Goals page to add one!</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;