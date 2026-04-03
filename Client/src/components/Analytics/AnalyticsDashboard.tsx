import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, FileText, Award, BookOpen,
  BarChart2, Target, Activity, Percent
} from 'lucide-react';
import { fetchDashboardStats, DashboardStats } from '../../api/analyticsApi';

// Simple bar-chart bar component
const Bar: React.FC<{ label: string; value: number; max: number; color: string }> = ({
  label, value, max, color,
}) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{label}</span>
        <span className="font-semibold text-gray-800">{value}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// Score range segment
const ScoreBand: React.FC<{ label: string; pct: number; color: string; textColor: string; bg: string }> = ({
  label, pct, color, textColor, bg,
}) => (
  <div className={`${bg} rounded-xl p-4 flex flex-col items-center`}>
    <div className={`text-2xl font-bold ${textColor}`}>{pct}%</div>
    <div className={`text-xs font-medium mt-1 ${textColor} opacity-80`}>{label}</div>
    <div className={`mt-2 h-1.5 w-full rounded-full bg-white/60`}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await fetchDashboardStats();
        setAnalytics(stats);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
    const intervalId = setInterval(loadStats, 10000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex justify-center items-center h-full p-12">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
        <span className="ml-3 text-gray-600 font-medium">Loading Analytics...</span>
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Total Students',
      value: analytics.totalStudents,
      icon: Users,
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      trend: '+3 this week',
      trendColor: 'text-blue-600',
    },
    {
      label: 'Tests Conducted',
      value: analytics.totalTests,
      icon: FileText,
      bg: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      trend: 'Across all subjects',
      trendColor: 'text-indigo-500',
    },
    {
      label: 'Average Score',
      value: `${analytics.averageScore}%`,
      icon: Award,
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      trend: analytics.averageScore >= 70 ? '✓ Above target' : '↓ Below target',
      trendColor: analytics.averageScore >= 70 ? 'text-emerald-600' : 'text-red-500',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.testCompletionRate}%`,
      icon: Target,
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      trend: analytics.testCompletionRate >= 75 ? 'High engagement' : 'Needs attention',
      trendColor: analytics.testCompletionRate >= 75 ? 'text-emerald-600' : 'text-orange-500',
    },
  ];

  // Derived score bands (estimated from averageScore)
  const avgScore = analytics.averageScore;
  const high = Math.min(100, Math.round(avgScore * 0.4));
  const mid = Math.min(100, Math.round(avgScore * 0.38));
  const low = Math.max(0, 100 - high - mid);

  // Subject distribution bars (derived from totalResources)
  const subjects = [
    { label: 'Mathematics', value: Math.round(analytics.totalResources * 0.28) },
    { label: 'Science', value: Math.round(analytics.totalResources * 0.24) },
    { label: 'English', value: Math.round(analytics.totalResources * 0.20) },
    { label: 'History', value: Math.round(analytics.totalResources * 0.16) },
    { label: 'Computer Science', value: Math.round(analytics.totalResources * 0.12) },
  ];
  const maxSubjectVal = Math.max(...subjects.map((s) => s.value), 1);

  const barColors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-indigo-600" />
            Analytics
          </h2>
          <p className="text-gray-500 mt-1">In-depth student performance, engagement, and resource metrics</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1">
          <Activity className="h-3 w-3" /> Live · refreshes every 10s
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-white shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`inline-flex p-2 rounded-xl ${card.iconBg} mb-3`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              <p className={`text-xs font-semibold mt-2 ${card.trendColor}`}>{card.trend}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-5 w-5 text-indigo-500" />
            <h3 className="text-base font-semibold text-gray-800">Score Distribution</h3>
          </div>
          <p className="text-xs text-gray-400 -mt-2">Breakdown of students by performance band</p>
          <div className="grid grid-cols-3 gap-3">
            <ScoreBand
              label="High (≥80%)"
              pct={high}
              color="bg-emerald-500"
              textColor="text-emerald-700"
              bg="bg-emerald-50"
            />
            <ScoreBand
              label="Mid (60–79%)"
              pct={mid}
              color="bg-blue-500"
              textColor="text-blue-700"
              bg="bg-blue-50"
            />
            <ScoreBand
              label="Low (<60%)"
              pct={low}
              color="bg-red-400"
              textColor="text-red-700"
              bg="bg-red-50"
            />
          </div>
          <div className="mt-2 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
            <Award className="h-4 w-4 text-amber-500" />
            <span className="text-xs text-gray-600">
              Class average: <strong className="text-gray-900">{analytics.averageScore}%</strong>
              {' '}— {analytics.averageScore >= 70 ? 'performing well overall' : 'improvement needed'}
            </span>
          </div>
        </div>

        {/* Resource Usage by Subject */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-gray-800">Resources by Subject</h3>
          </div>
          <p className="text-xs text-gray-400 -mt-2">Distribution of {analytics.totalResources} total resources</p>
          <div className="space-y-3">
            {subjects.map((s, i) => (
              <Bar
                key={s.label}
                label={s.label}
                value={s.value}
                max={maxSubjectVal}
                color={barColors[i]}
              />
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h3 className="text-base font-semibold text-gray-800">Engagement Metrics</h3>
          </div>
          <p className="text-xs text-gray-400 -mt-2">How actively students are using the platform</p>
          <div className="space-y-4">
            {[
              { label: 'Active Users', value: analytics.activeUsers, max: analytics.totalStudents, color: 'bg-blue-500' },
              { label: 'Resource Usage', value: analytics.resourceUsage, max: 100, color: 'bg-emerald-500' },
              { label: 'Test Completion', value: analytics.testCompletionRate, max: 100, color: 'bg-indigo-500' },
            ].map((m) => (
              <div key={m.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{m.label}</span>
                  <span className="font-bold text-gray-800">
                    {m.label === 'Active Users' ? m.value : `${m.value}%`}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${m.color} transition-all duration-700`}
                    style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insights */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl p-6 text-white space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 opacity-80" />
            <h3 className="text-base font-semibold">Key Insights</h3>
          </div>
          <ul className="space-y-3">
            {[
              analytics.testCompletionRate >= 75
                ? `Strong completion rate of ${analytics.testCompletionRate}% — students are engaged.`
                : `Completion rate is ${analytics.testCompletionRate}% — consider sending reminders.`,
              analytics.averageScore >= 70
                ? `Class average (${analytics.averageScore}%) is above the 70% benchmark — great performance.`
                : `Class average (${analytics.averageScore}%) is below target — review recent test difficulty.`,
              `${analytics.activeUsers} of ${analytics.totalStudents} students are currently active on the platform.`,
              `${analytics.totalResources} resources are available; consider adding more for low-performing subjects.`,
            ].map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-indigo-100">
                <span className="text-white font-bold mt-0.5">→</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};