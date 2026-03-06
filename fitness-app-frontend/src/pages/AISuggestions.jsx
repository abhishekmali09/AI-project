import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from 'react-oauth2-code-pkce';
import { FiCpu, FiRefreshCw } from 'react-icons/fi';
import { getUserRecommendations } from '../services/api';
import { getActivityConfig } from '../utils/activityHelpers';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';

const AISuggestions = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tokenData } = useContext(AuthContext);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }
      const res = await getUserRecommendations(userId);
      setRecommendations(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecommendations(); }, []);

  if (loading) return <PageWrapper><LoadingSpinner text="Consulting your AI coach..." /></PageWrapper>;

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <FiCpu className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-white">AI Coach</h1>
            </div>
            <p className="text-slate-400">Personalized recommendations from your AI fitness coach</p>
          </div>
          <Button variant="ghost" icon={FiRefreshCw} onClick={fetchRecommendations} size="sm">
            Refresh
          </Button>
        </motion.div>

        {error ? (
          <GlassCard hover={false} className="text-center py-12">
            <p className="text-accent mb-4">{error}</p>
            <Button onClick={fetchRecommendations} size="sm">Try Again</Button>
          </GlassCard>
        ) : recommendations.length === 0 ? (
          <motion.div variants={fadeInUp}>
            <GlassCard hover={false} className="text-center py-16">
              <FiCpu className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Recommendations Yet</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Log some activities and our AI will analyze your performance and provide personalized coaching tips.
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec, i) => {
              const config = getActivityConfig(rec.activityType);
              const Icon = config.icon;
              return (
                <motion.div
                  key={rec.id || i}
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <GlassCard hover={false} className="relative overflow-hidden">
                    <div
                      className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-10 pointer-events-none"
                      style={{ background: config.color }}
                    />

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-5 relative z-10">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: `${config.color}15` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{config.label} Analysis</p>
                        <p className="text-xs text-slate-500">
                          {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>

                    {/* Analysis */}
                    {rec.recommendation && (
                      <div className="mb-5">
                        <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Analysis</h4>
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{rec.recommendation}</p>
                      </div>
                    )}

                    {/* Improvements */}
                    {rec.improvments?.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Improvements</h4>
                        <div className="space-y-2">
                          {rec.improvments.map((item, j) => (
                            <div key={j} className="flex gap-2">
                              <span className="text-secondary text-sm">→</span>
                              <p className="text-sm text-slate-300">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {rec.suggerstion?.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Suggested Workouts</h4>
                        <div className="space-y-2">
                          {rec.suggerstion.map((item, j) => (
                            <div key={j} className="flex gap-2">
                              <span className="text-accent text-sm">→</span>
                              <p className="text-sm text-slate-300">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Safety */}
                    {rec.safety?.length > 0 && (
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">⚠ Safety</h4>
                        <ul className="space-y-1">
                          {rec.safety.map((item, j) => (
                            <li key={j} className="text-sm text-slate-400 flex gap-2">
                              <span className="text-yellow-400">•</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </PageWrapper>
  );
};

export default AISuggestions;
