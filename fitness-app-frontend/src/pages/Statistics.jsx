import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line
} from 'recharts';
import { FiTrendingUp, FiZap, FiClock, FiActivity } from 'react-icons/fi';
import { getActivities } from '../services/api';
import { getActivityConfig } from '../utils/activityHelpers';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CHART_COLORS = ['#6C63FF', '#00D9A6', '#FF6B6B', '#FBBF24', '#00B4D8', '#A78BFA', '#F472B6', '#34D399'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="text-white font-medium mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const Statistics = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getActivities();
        setActivities(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <PageWrapper><LoadingSpinner text="Crunching your stats..." /></PageWrapper>;

  // Prepare chart data
  const totalCalories = activities.reduce((s, a) => s + (a.caloriesBurned || 0), 0);
  const totalDuration = activities.reduce((s, a) => s + (a.duration || 0), 0);
  const avgCalories = activities.length ? Math.round(totalCalories / activities.length) : 0;

  // Activity type distribution for Pie
  const typeMap = {};
  activities.forEach(a => {
    if (!typeMap[a.type]) typeMap[a.type] = { count: 0, calories: 0, duration: 0 };
    typeMap[a.type].count++;
    typeMap[a.type].calories += a.caloriesBurned || 0;
    typeMap[a.type].duration += a.duration || 0;
  });
  const pieData = Object.entries(typeMap).map(([type, data]) => ({
    name: getActivityConfig(type).label,
    value: data.count,
    color: getActivityConfig(type).color,
  }));

  // Calories per activity type for Bar
  const barData = Object.entries(typeMap).map(([type, data]) => ({
    name: getActivityConfig(type).label,
    calories: data.calories,
    duration: data.duration,
    fill: getActivityConfig(type).color,
  }));

  // Timeline data (last 10 activities by order)
  const timelineData = [...activities].reverse().slice(0, 15).reverse().map((a, i) => ({
    name: `#${i + 1}`,
    calories: a.caloriesBurned || 0,
    duration: a.duration || 0,
  }));

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Statistics</h1>
          <p className="text-slate-400 mt-1">Insights from {activities.length} workouts</p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Workouts', value: activities.length, icon: FiActivity, color: '#6C63FF' },
            { label: 'Total Calories', value: totalCalories.toLocaleString(), icon: FiZap, color: '#FF6B6B' },
            { label: 'Total Minutes', value: totalDuration.toLocaleString(), icon: FiClock, color: '#00D9A6' },
            { label: 'Avg Calories', value: avgCalories, icon: FiTrendingUp, color: '#FBBF24' },
          ].map(stat => (
            <GlassCard key={stat.label} className="text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {activities.length === 0 ? (
          <GlassCard hover={false} className="text-center py-16">
            <p className="text-slate-400">No activity data to display charts. Start logging activities!</p>
          </GlassCard>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calories by Type - Bar Chart */}
            <motion.div variants={fadeInUp}>
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-4">Calories by Activity Type</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Activity Distribution - Pie Chart */}
            <motion.div variants={fadeInUp}>
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-4">Activity Distribution</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="text-xs text-slate-400">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Calories Trend - Area Chart */}
            <motion.div variants={fadeInUp}>
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-4">Calories Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="caloriesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="calories" stroke="#FF6B6B" fill="url(#caloriesGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Duration Trend - Line Chart */}
            <motion.div variants={fadeInUp}>
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold text-white mb-4">Duration Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="duration" stroke="#00D9A6" strokeWidth={2} dot={{ fill: '#00D9A6', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default Statistics;
