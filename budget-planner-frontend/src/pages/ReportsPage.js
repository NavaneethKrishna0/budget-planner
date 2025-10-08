import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import './ReportsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081/api';

const ReportsPage = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [activeFilter, setActiveFilter] = useState('This Month');
    
    // State for KPIs and Charts
    const [kpis, setKpis] = useState({ totalSpent: 0, avgDailySpend: 0, transactionCount: 0 });
    const [categoryChartData, setCategoryChartData] = useState({ labels: [], datasets: [] });
    const [trendChartData, setTrendChartData] = useState({ labels: [], datasets: [] });

    // Fetch all transactions once on component mount
    useEffect(() => {
        axios.get(`${API_BASE_URL}/transactions`)
            .then(response => {
                setAllTransactions(response.data);
            })
            .catch(error => console.error("Error fetching transactions:", error));
    }, []);

    // This effect runs whenever the source transactions or the active filter changes
    useEffect(() => {
        const now = new Date();
        let startDate = new Date();

        if (activeFilter === 'This Month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (activeFilter === 'Last Month') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            now.setDate(0); // End of last month
        } else if (activeFilter === 'All Time') {
            startDate = new Date(0); // The earliest possible date
        }

        const filtered = allTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= startDate && transactionDate <= now;
        });

        setFilteredTransactions(filtered);

    }, [allTransactions, activeFilter]);

    // This effect recalculates all stats and chart data when the filtered data changes
    useEffect(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');

        // Calculate KPIs
        const totalSpent = expenses.reduce((acc, t) => acc + t.amount, 0);
        const uniqueDays = new Set(expenses.map(t => t.date)).size;
        const avgDailySpend = uniqueDays > 0 ? totalSpent / uniqueDays : 0;
        setKpis({ totalSpent, avgDailySpend, transactionCount: expenses.length });

        // Process data for Category Bar Chart
        const categoryData = expenses.reduce((acc, t) => {
            const category = t.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});
        setCategoryChartData({
            labels: Object.keys(categoryData),
            datasets: [{
                label: 'Spending by Category',
                data: Object.values(categoryData),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            }]
        });

        // Process data for Spending Trend Line Chart
        const trendData = expenses.reduce((acc, t) => {
            const date = new Date(t.date).toLocaleDateString();
            acc[date] = (acc[date] || 0) + t.amount;
            return acc;
        }, {});
        const sortedTrend = Object.entries(trendData).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        setTrendChartData({
            labels: sortedTrend.map(entry => entry[0]),
            datasets: [{
                label: 'Spending Trend',
                data: sortedTrend.map(entry => entry[1]),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        });

    }, [filteredTransactions]);

    const filterButtons = ['This Month', 'Last Month', 'All Time'];

    return (
        <div className="reports-container">
            <h1>Reports</h1>

            <div className="filters">
                {filterButtons.map(filter => (
                    <button 
                        key={filter} 
                        className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="kpi-cards">
                <div className="kpi-card">
                    <p>Total Spent</p>
                    <h3>${kpis.totalSpent.toFixed(2)}</h3>
                </div>
                <div className="kpi-card">
                    <p>Transactions</p>
                    <h3>{kpis.transactionCount}</h3>
                </div>
                <div className="kpi-card">
                    <p>Avg. Daily Spend</p>
                    <h3>${kpis.avgDailySpend.toFixed(2)}</h3>
                </div>
            </div>
            
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Spending by Category</h3>
                    <Bar data={categoryChartData} />
                </div>
                <div className="chart-card">
                    <h3>Spending Trend</h3>
                    <Line data={trendChartData} />
                </div>
            </div>

            <div className="transactions-table-card">
                <h3>Transactions for {activeFilter}</h3>
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th className="amount-col">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.filter(t => t.type === 'expense').map(t => (
                                <tr key={t.id}>
                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                    <td>{t.description}</td>
                                    <td>{t.category}</td>
                                    <td className="amount-col expense">-${t.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;