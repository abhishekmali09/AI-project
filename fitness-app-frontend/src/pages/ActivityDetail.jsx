import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router';
import { FiArrowLeft, FiClock, FiZap, FiCalendar, FiCpu } from 'react-icons/fi';
import { getActivityById, getActivityRecommendation } from '../services/api';
import { getActivityConfig, formatDuration, formatDate } from '../utils/activityHelpers';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const actRes = await getActivityById(id);
        setActivity(actRes.data);
        try {
          const recRes = await getActivityRecommendation(id);
          setRecommendation(recRes.data);
        } catch {
          // Recommendation may not exist yet — that's fine
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load activity details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <PageWrapper><LoadingSpinner text="Loading activity..." /></PageWrapper>;
  if (error) return (
    <PageWrapper>
      <div className="text-center py-20">
        <p className="text-accent mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline cursor-pointer">Go Back</button>
      </div>
    </PageWrapper>
  );
  if (!activity) return (
    <PageWrapper>
      <div className="text-center py-20 text-slate-400">Activity not found.</div>
    </PageWrapper>
  );

  const config = getActivityConfig(activity.type);
  const Icon = config.icon;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Back Button */}
        <motion.button
          variants={fadeInUp}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </motion.button>

        {/* Activity Header Card */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="relative overflow-hidden mb-6">
            {/* BG gradient accent */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
              style={{ background: config.color }}
            />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${config.color}20` }}
              >
                <Icon className="w-10 h-10" style={{ color: config.color }} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{config.label}</h1>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FiClock className="w-4 h-4" />
                    <span className="text-sm">{formatDuration(activity.duration)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FiZap className="w-4 h-4" />
                    <span className="text-sm">{activity.caloriesBurned || 0} kcal</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(activity.startTime)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">{key}</p>
                    <p className="text-lg font-semibold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* AI Recommendation */}
        {recommendation ? (
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-2 mb-4">
              <FiCpu className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-white">AI Analysis</h2>
            </div>

            {/* Recommendation Text */}
            {recommendation.recommendation && (
              <GlassCard hover={false} className="mb-4">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Analysis</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {recommendation.recommendation}
                </p>
              </GlassCard>
            )}

            {/* Improvements */}
            {recommendation.improvments?.length > 0 && (
              <GlassCard hover={false} className="mb-4">
                <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Improvements</h3>
                <div className="space-y-3">
                  {recommendation.improvments.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-secondary">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-300">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Suggestions */}
            {recommendation.suggerstion?.length > 0 && (
              <GlassCard hover={false} className="mb-4">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">Suggested Workouts</h3>
                <div className="space-y-3">
                  {recommendation.suggerstion.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-300">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Safety */}
            {recommendation.safety?.length > 0 && (
              <GlassCard hover={false} className="mb-4">
                <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-3">⚠️ Safety Guidelines</h3>
                <ul className="space-y-2">
                  {recommendation.safety.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-slate-300">
                      <span className="text-yellow-400">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp}>
            <GlassCard hover={false} className="text-center py-10">
              <FiCpu className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">AI recommendation is being generated...</p>
              <p className="text-slate-600 text-xs mt-1">Check back in a moment</p>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default ActivityDetail;
