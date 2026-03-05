import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { FiPlus, FiX, FiSearch, FiFilter } from 'react-icons/fi';
import { getActivities, addActivity } from '../services/api';
import { ACTIVITY_TYPES, getActivityConfig, formatDuration, formatDate } from '../utils/activityHelpers';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ActivityTracker = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
  });

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(res.data || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addActivity({
        ...form,
        duration: Number(form.duration),
        caloriesBurned: Number(form.caloriesBurned),
        startTime: new Date().toISOString().slice(0, -1),
      });
      setShowForm(false);
      setForm({ type: 'RUNNING', duration: '', caloriesBurned: '' });
      fetchActivities();
    } catch (err) {
      console.error('Error adding activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredActivities = activities
    .filter(a => filter === 'ALL' || a.type === filter)
    .filter(a => {
      if (!search) return true;
      const config = getActivityConfig(a.type);
      return config.label.toLowerCase().includes(search.toLowerCase());
    })
    .reverse();

  if (loading) return <PageWrapper><LoadingSpinner text="Loading activities..." /></PageWrapper>;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Header  */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Activity Tracker</h1>
            <p className="text-slate-400 mt-1">{activities.length} total activities logged</p>
          </div>
          <Button icon={FiPlus} onClick={() => setShowForm(true)}>
            New Activity
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <FiFilter className="text-slate-500 w-4 h-4 shrink-0" />
            {['ALL', ...new Set(activities.map(a => a.type))].map(type => {
              const config = type !== 'ALL' ? getActivityConfig(type) : null;
              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer
                    ${filter === type
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                    }`}
                >
                  {type === 'ALL' ? 'All' : config?.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Activity List */}
        <motion.div variants={fadeInUp} className="space-y-3">
          {filteredActivities.length === 0 ? (
            <GlassCard hover={false} className="text-center py-16">
              <p className="text-slate-400 mb-4">No activities found</p>
              <Button onClick={() => setShowForm(true)} size="sm">Log an Activity</Button>
            </GlassCard>
          ) : (
            filteredActivities.map((activity, i) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="glass-card p-4 sm:p-5 flex items-center gap-4 cursor-pointer"
                >
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${config.color}15` }}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-white">{config.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(activity.startTime)}</p>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-sm text-slate-300">{formatDuration(activity.duration)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-white">{activity.caloriesBurned || 0}</p>
                    <p className="text-xs text-slate-500">kcal</p>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Add Activity Modal */}
        <AnimatePresence>
          {showForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setShowForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md glass-card p-6 z-50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Log New Activity</h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Type Selection */}
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Activity Type</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {ACTIVITY_TYPES.slice(0, 8).map(at => {
                        const Icon = at.icon;
                        const isActive = form.type === at.value;
                        return (
                          <button
                            key={at.value}
                            type="button"
                            onClick={() => setForm({ ...form, type: at.value })}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs font-medium transition-all cursor-pointer
                              ${isActive
                                ? 'border-2 text-white'
                                : 'bg-white/5 border border-white/5 text-slate-400 hover:bg-white/10'
                              }`}
                            style={isActive ? { borderColor: at.color, background: `${at.color}15` } : {}}
                          >
                            <Icon className="w-5 h-5" style={{ color: isActive ? at.color : undefined }} />
                            <span>{at.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                      placeholder="30"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  {/* Calories */}
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Calories Burned</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.caloriesBurned}
                      onChange={e => setForm({ ...form, caloriesBurned: e.target.value })}
                      placeholder="250"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <Button type="submit" className="w-full" loading={submitting}>
                    Save Activity
                  </Button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
};

export default ActivityTracker;
