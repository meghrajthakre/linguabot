import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  MessageSquare,
  Zap,
  BarChart3,
  Download,
  Calendar,
} from "lucide-react";

/**
 * Analytics Page Component
 * Modern SaaS analytics dashboard for LinguaBot
 * Features: Overview cards, time series chart, top questions, recent conversations
 */
const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d");

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data = await response.json();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header Section */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Analytics
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Track your LinguaBot performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 hover:border-slate-600 transition-colors cursor-pointer font-medium text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium text-sm">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm font-medium">Error: {error}</p>
          </div>
        )}

        {analytics && (
          <>
            {/* Overview Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <OverviewCard
                title="Total Bots"
                value={analytics.totalBots}
                icon={TrendingUp}
                change="+2.5%"
                bgGradient="from-blue-500/20 to-cyan-500/20"
                iconColor="text-cyan-400"
              />
              <OverviewCard
                title="Total Conversations"
                value={analytics.totalConversations}
                icon={MessageSquare}
                change="+12.3%"
                bgGradient="from-purple-500/20 to-pink-500/20"
                iconColor="text-pink-400"
              />
              <OverviewCard
                title="Active Bots"
                value={analytics.activeBots}
                icon={Zap}
                change={`${Math.round((analytics.activeBots / analytics.totalBots) * 100)}%`}
                bgGradient="from-orange-500/20 to-red-500/20"
                iconColor="text-orange-400"
              />
              <OverviewCard
                title="Avg Response Time"
                value={`${analytics.averageResponseTime}ms`}
                icon={BarChart3}
                change="-8.2%"
                bgGradient="from-emerald-500/20 to-teal-500/20"
                iconColor="text-emerald-400"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Messages Per Day Chart */}
              <div className="lg:col-span-2 bg-slate-800/40 border border-slate-700 rounded-lg p-6 backdrop-blur">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white">
                    Messages Per Day
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Last {dateRange === "7d" ? "7" : dateRange === "30d" ? "30" : "90"}{" "}
                    days activity
                  </p>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.messagesPerDay}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(71, 85, 105, 0.3)"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="rgba(148, 163, 184, 0.5)"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis
                      stroke="rgba(148, 163, 184, 0.5)"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(71, 85, 105, 0.5)",
                        borderRadius: "8px",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                      }}
                      labelStyle={{ color: "rgba(226, 232, 240, 1)" }}
                      formatter={(value) => [
                        `${value} messages`,
                        "Daily Activity",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="url(#colorGradient)"
                      strokeWidth={2.5}
                      dot={{
                        fill: "rgba(6, 182, 212, 1)",
                        r: 4,
                        opacity: 0.8,
                      }}
                      activeDot={{
                        r: 6,
                        shadowColor: "rgba(6, 182, 212, 0.5)",
                        shadowBlur: 10,
                      }}
                      animationDuration={600}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="100%"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="rgba(6, 182, 212, 1)" />
                        <stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Bots Summary */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 backdrop-blur">
                <h2 className="text-lg font-bold text-white mb-4">
                  Performance Summary
                </h2>
                <div className="space-y-4">
                  <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">
                      Total Messages
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {analytics.totalConversations}
                    </p>
                    <p className="text-emerald-400 text-xs mt-2">+12.3% today</p>
                  </div>

                  <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">
                      Avg Response Time
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {analytics.averageResponseTime}ms
                    </p>
                    <p className="text-blue-400 text-xs mt-2">Performance OK</p>
                  </div>

                  <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <p className="text-slate-400 text-xs uppercase font-semibold tracking-wide">
                      Active Bots
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {analytics.activeBots}/{analytics.totalBots}
                    </p>
                    <p className="text-yellow-400 text-xs mt-2">
                      {Math.round((analytics.activeBots / analytics.totalBots) * 100)}% Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Questions Table */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden backdrop-blur">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white">
                    Top Questions
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Most frequently asked questions
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-900/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Question
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topQuestions.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-200">
                            <div className="max-w-xs truncate">
                              {item.question}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                              {item.count}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {analytics.topQuestions.length === 0 && (
                        <tr>
                          <td
                            colSpan="2"
                            className="px-6 py-8 text-center text-slate-400"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Conversations Table */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-lg overflow-hidden backdrop-blur">
                <div className="p-6 border-b border-slate-700">
                  <h2 className="text-lg font-bold text-white">
                    Recent Conversations
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Latest 10 messages</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 bg-slate-900/50">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Bot
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Response Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wide">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recentConversations.map((conv, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-slate-200 font-medium">
                            {conv.botName}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                conv.responseTimeMs < 500
                                  ? "bg-emerald-500/20 text-emerald-300"
                                  : conv.responseTimeMs < 1000
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : "bg-red-500/20 text-red-300"
                              }`}
                            >
                              {conv.responseTimeMs}ms
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-xs">
                            {new Date(conv.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                      {analytics.recentConversations.length === 0 && (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-8 text-center text-slate-400"
                          >
                            No conversations yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/**
 * Overview Card Component
 * Reusable card for displaying key metrics
 */
const OverviewCard = ({
  title,
  value,
  icon: Icon,
  change,
  bgGradient,
  iconColor,
}) => {
  return (
    <div className="group relative">
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bgGradient} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur`}
      />

      <div className="relative bg-slate-800/40 border border-slate-700 rounded-lg p-6 backdrop-blur hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
            {title}
          </h3>
          <div className={`p-2 rounded-lg bg-slate-700/50 ${iconColor}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-emerald-400 text-xs font-semibold">{change}</span>
          <span className="text-slate-500 text-xs">vs last period</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;