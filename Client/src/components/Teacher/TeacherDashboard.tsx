import React, { useState, useEffect } from 'react';
import { Users, FileText, BookOpen, PlusCircle, Upload, ClipboardList, Clock, TrendingUp, CheckCircle2, MessageCircle, Star, Award, Target } from 'lucide-react';
import { fetchDashboardStats, DashboardStats } from '../../api/analyticsApi';
import { useAuth } from '../../contexts/AuthContext';

interface TeacherDashboardProps {
  onAction?: (tab: string, subView?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onAction }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();

    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const greeting = () => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isAdmin = user?.role === 'admin';

  // ─── Header gradient & subtitle per role ─────────────────────────────────
  const headerGradient = isStudent
    ? 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)'
    : isAdmin
    ? 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)';

  const headerSubtitle = isStudent
    ? "Track your progress and keep learning today."
    : isAdmin
    ? "Here's a full overview of platform activity."
    : "Here's what's happening with your classes today.";

  const displayName = user?.name || (isStudent ? 'Student' : isTeacher ? 'Teacher' : 'Admin');

  // ─── Quick Actions ────────────────────────────────────────────────────────
  const getQuickActions = () => {
    if (isTeacher) return [
      { label: 'Create New Test', icon: PlusCircle, color: 'from-indigo-500 to-blue-600', description: 'Design a new quiz or exam', tab: 'tests', subView: 'create' },
      { label: 'Upload Resource', icon: Upload, color: 'from-emerald-500 to-teal-600', description: 'Add study material for students', tab: 'resources', subView: 'upload' },
      { label: 'View Submissions', icon: ClipboardList, color: 'from-orange-500 to-amber-600', description: 'Check recent test attempts', tab: 'tests', subView: 'list' },
    ];
    if (isStudent) return [
      { label: 'AI Assistant', icon: MessageCircle, color: 'from-emerald-500 to-cyan-600', description: 'Get instant help with doubts', tab: 'chat' },
      { label: 'Take a Test', icon: Target, color: 'from-blue-500 to-indigo-600', description: 'Test your knowledge now', tab: 'tests' },
      { label: 'Browse Resources', icon: BookOpen, color: 'from-orange-500 to-amber-600', description: 'Find study materials', tab: 'resources' },
    ];
    if (isAdmin) return [
      { label: 'Manage Users', icon: Users, color: 'from-indigo-500 to-blue-600', description: 'View and edit user accounts', tab: 'users' },
      { label: 'System Analytics', icon: TrendingUp, color: 'from-emerald-500 to-teal-600', description: 'Check platform performance', tab: 'analytics' },
      { label: 'Admin Panel', icon: ClipboardList, color: 'from-violet-500 to-purple-600', description: 'Access advanced settings', tab: 'admin' },
    ];
    return [];
  };

  const quickActions = getQuickActions();

  // ─── Stat Cards ───────────────────────────────────────────────────────────
  const getStatCards = () => {
    if (!stats) return [];
    if (isTeacher) return [
      { label: 'My Students', value: stats.totalStudents, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
      { label: 'Tests Created', value: stats.totalTests, icon: FileText, bg: 'bg-indigo-50', iconColor: 'text-indigo-600', textColor: 'text-indigo-700' },
      { label: 'Resources Shared', value: stats.totalResources, icon: BookOpen, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-700' },
      { label: 'Avg. Score', value: `${stats.averageScore}%`, icon: TrendingUp, bg: 'bg-orange-50', iconColor: 'text-orange-600', textColor: 'text-orange-700' },
    ];
    if (isStudent) return [
      { label: 'Tests Available', value: stats.totalTests, icon: FileText, bg: 'bg-sky-50', iconColor: 'text-sky-600', textColor: 'text-sky-700' },
      { label: 'Study Materials', value: stats.totalResources, icon: BookOpen, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-700' },
      { label: 'Platform Avg.', value: `${stats.averageScore}%`, icon: Award, bg: 'bg-amber-50', iconColor: 'text-amber-600', textColor: 'text-amber-700' },
      { label: 'Active Peers', value: stats.activeUsers, icon: Users, bg: 'bg-purple-50', iconColor: 'text-purple-600', textColor: 'text-purple-700' },
    ];
    // admin
    return [
      { label: 'Total Users', value: stats.totalStudents, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600', textColor: 'text-blue-700' },
      { label: 'Total Tests', value: stats.totalTests, icon: FileText, bg: 'bg-indigo-50', iconColor: 'text-indigo-600', textColor: 'text-indigo-700' },
      { label: 'Total Resources', value: stats.totalResources, icon: BookOpen, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', textColor: 'text-emerald-700' },
      { label: 'Platform Avg.', value: `${stats.averageScore}%`, icon: TrendingUp, bg: 'bg-orange-50', iconColor: 'text-orange-600', textColor: 'text-orange-700' },
    ];
  };

  const statCards = getStatCards();

  // ─── Activity Summary rows per role ───────────────────────────────────────
  const getActivityRows = () => {
    if (isStudent) return [
      { label: 'Tests available for you', value: stats?.totalTests ?? '—', icon: FileText, color: 'text-sky-500', bg: 'bg-sky-50' },
      { label: 'Study resources published', value: stats?.totalResources ?? '—', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Platform average score', value: stats ? `${stats.averageScore}%` : '—', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
      { label: 'Students active today', value: stats?.activeUsers ?? '—', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];
    if (isAdmin) return [
      { label: 'Total registered users', value: stats?.totalStudents ?? '—', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { label: 'Total tests on platform', value: stats?.totalTests ?? '—', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: 'Test completion rate', value: stats ? `${stats.testCompletionRate}%` : '—', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Resources available', value: stats?.totalResources ?? '—', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];
    // teacher (default)
    return [
      { label: 'Tests assigned this week', value: stats?.totalTests ?? '—', icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50' },
      { label: 'Active students today', value: stats?.activeUsers ?? '—', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
      { label: 'Completion rate', value: stats ? `${stats.testCompletionRate}%` : '—', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50' },
      { label: 'Resources available', value: stats?.totalResources ?? '—', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
    ];
  };

  const activityRows = getActivityRows();
  const activityTitle = isStudent ? 'Your Learning Overview' : isAdmin ? 'Platform Overview' : 'Class Activity Summary';

  // ─── Tip per role ─────────────────────────────────────────────────────────
  const tipContent = isStudent
    ? (<p className="text-sm text-emerald-700"><strong>Tip:</strong> Use the <strong>AI Assistant</strong> to clear your doubts instantly, then reinforce learning by taking a practice test.</p>)
    : isAdmin
    ? (<p className="text-sm text-violet-700"><strong>Tip:</strong> Visit the <strong>Analytics</strong> section regularly to monitor user engagement, test completion rates, and platform health.</p>)
    : (<p className="text-sm text-indigo-700"><strong>Tip:</strong> Head to the <strong>Analytics</strong> section for detailed student performance charts, score distributions, and engagement trends.</p>);

  const tipBg = isStudent ? 'bg-emerald-50 border-emerald-100' : isAdmin ? 'bg-violet-50 border-violet-100' : 'bg-indigo-50 border-indigo-100';
  const tipIconColor = isStudent ? 'text-emerald-500' : isAdmin ? 'text-violet-500' : 'text-indigo-500';

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="rounded-2xl p-6 text-white shadow-lg" style={{ background: headerGradient }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium">{greeting()},</p>
            <h2 className="text-2xl font-bold mt-1">{displayName} 👋</h2>
            <p className="text-white/60 text-sm mt-1">{headerSubtitle}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-white/60 text-sm">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          <span className="ml-3 text-gray-500 font-medium">Loading your dashboard...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`${card.bg} p-5 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`inline-flex p-2 rounded-lg bg-white/70 mb-3`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className={`text-xs font-semibold mt-0.5 ${card.textColor}`}>{card.label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => onAction?.(action.tab, (action as any).subView)}
                className={`group bg-gradient-to-br ${action.color} p-5 rounded-2xl text-white text-left shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200`}
              >
                <Icon className="h-7 w-7 mb-3 opacity-90" />
                <p className="font-semibold text-base">{action.label}</p>
                <p className="text-sm opacity-80 mt-1">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{activityTitle}</h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {activityRows.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${tipBg}`}>
        <Clock className={`h-5 w-5 ${tipIconColor} mt-0.5 flex-shrink-0`} />
        {tipContent}
      </div>
    </div>
  );
};
