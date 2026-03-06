import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { AuthContext } from 'react-oauth2-code-pkce';
import { FiPlus, FiTrendingUp, FiClock, FiZap } from 'react-icons/fi';
import { getActivities } from '../services/api';
import { getActivityConfig, formatDuration, formatNumber } from '../utils/activityHelpers';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { tokenData } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getActivities();
        setActivities(res.data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCalories = activities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);
  const totalDuration = activities.reduce((sum, a) => sum + (a.duration || 0), 0);
  const totalWorkouts = activities.length;
  const recentActivities = [...activities].reverse().slice(0, 6);

  // Count by type
  const typeCounts = activities.reduce((acc, a) => {
    acc[a.type] = (acc[a.type] || 0) + 1;
    return acc;
  }, {});

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return <PageWrapper><LoadingSpinner text="Loading your dashboard..." /></PageWrapper>;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {greeting()}, <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{tokenData?.preferred_username || 'Athlete'}</span>
            </h1>
            <p className="text-slate-400 mt-1">Here's your fitness summary</p>
          </div>
          <Button icon={FiPlus} onClick={() => navigate('/activities')}>
            Log Activity
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Calories', value: formatNumber(totalCalories), unit: 'kcal', icon: FiZap, color: '#FF6B6B', progress: Math.min((totalCalories / 5000) * 100, 100) },
            { label: 'Training Time', value: formatDuration(totalDuration), unit: '', icon: FiClock, color: '#00D9A6', progress: Math.min((totalDuration / 600) * 100, 100) },
            { label: 'Workouts', value: totalWorkouts.toString(), unit: 'sessions', icon: FiTrendingUp, color: '#6C63FF', progress: Math.min((totalWorkouts / 30) * 100, 100) },
          ].map((stat) => (
            <GlassCard key={stat.label} className="flex items-center gap-5">
              <ProgressRing
                radius={36}
                stroke={5}
                progress={stat.progress}
                color={stat.color}
                value={stat.value}
                unit={stat.unit}
              />
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  <span className="text-lg font-semibold text-white">{stat.value}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </motion.div>

        {/* Activity Cards by Type */}
        <motion.div variants={fadeInUp}>
          <h2 className="text-xl font-semibold text-white mb-4">Your Activities</h2>
          {Object.keys(typeCounts).length === 0 ? (
            <GlassCard hover={false} className="text-center py-12">
              <FiActivity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No activities yet. Start your fitness journey!</p>
              <Button onClick={() => navigate('/activities')}>Log Your First Activity</Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {Object.entries(typeCounts).map(([type, count]) => {
                const config = getActivityConfig(type);
                const Icon = config.icon;
                return (
                  <GlassCard
                    key={type}
                    onClick={() => navigate('/activities')}
                    className="text-center group"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${config.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: config.color }} />
                    </div>
                    <p className="text-sm font-medium text-white">{config.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{count} session{count !== 1 ? 's' : ''}</p>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Activity List */}
        {recentActivities.length > 0 && (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
              <button
                onClick={() => navigate('/activities')}
                className="text-sm text-primary hover:text-primary-light transition-colors cursor-pointer"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => {
                const config = getActivityConfig(activity.type);
                const Icon = config.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                    className="glass-card p-4 flex items-center gap-4 cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${config.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{config.label}</p>
                      <p className="text-xs text-slate-500">{formatDuration(activity.duration)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-white">{activity.caloriesBurned || 0}</p>
                      <p className="text-xs text-slate-500">kcal</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default Dashboard;
