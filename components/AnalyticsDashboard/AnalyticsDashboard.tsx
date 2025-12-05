'use client';

import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
    totalTime: number;
    totalSessions: number;
    avgSessionLength: number;
    subjectData: { name: string; value: number; percentage: number }[];
    trendData: { date: string; sessions: number }[];
    weeklyActivity: { day: string; sessions: number }[];
}

interface AnalyticsDashboardProps {
    data: AnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AnalyticsDashboard = ({ data }: AnalyticsDashboardProps) => {
    const { totalTime, totalSessions, avgSessionLength, subjectData, trendData, weeklyActivity } = data;

    const formatHours = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    return (
        <div className="analytics-dashboard">
            <div className="analytics-header">
                <h2>📊 Learning Analytics</h2>
                <p className="analytics-subtitle">Track your progress and insights</p>
            </div>

            {/* Summary Stats */}
            <div className="analytics-stats">
                <div className="analytics-stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                        <p className="stat-value">{formatHours(totalTime)}</p>
                        <p className="stat-label">Total Learning Time</p>
                    </div>
                </div>
                <div className="analytics-stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <p className="stat-value">{totalSessions}</p>
                        <p className="stat-label">Total Sessions</p>
                    </div>
                </div>
                <div className="analytics-stat-card">
                    <div className="stat-icon">⚡</div>
                    <div className="stat-content">
                        <p className="stat-value">{formatHours(avgSessionLength)}</p>
                        <p className="stat-label">Avg Session Length</p>
                    </div>
                </div>
            </div>

            <div className="analytics-charts">
                {subjectData.length > 0 && (
                    <div className="chart-container">
                        <h3>📖 Learning Time by Subject</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={subjectData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {subjectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatHours(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="chart-container">
                    <h3>📅 Weekly Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyActivity}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sessions" fill="#8884d8" name="Sessions" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {trendData.length > 1 && (
                    <div className="chart-container full-width">
                        <h3>📈 Session Completion Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="sessions" stroke="#82ca9d" name="Sessions" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {subjectData.length > 0 && (
                    <div className="chart-container full-width">
                        <h3>🎯 Most Active Subjects</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={subjectData.slice(0, 5)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip formatter={(value: number) => formatHours(value)} />
                                <Legend />
                                <Bar dataKey="value" fill="#0088FE" name="Time (minutes)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
