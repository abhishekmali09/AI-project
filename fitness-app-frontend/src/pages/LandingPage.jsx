import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { AuthContext } from 'react-oauth2-code-pkce';
import { FiZap, FiActivity, FiBarChart2, FiCpu, FiArrowRight, FiHeart } from 'react-icons/fi';
import { BiCycling } from 'react-icons/bi';
import Button from '../components/ui/Button';
import { staggerContainer, fadeInUp } from '../utils/animations';

const features = [
  { icon: FiActivity, title: 'Track Workouts', desc: 'Log running, cycling, swimming and more with detailed metrics.', color: '#6C63FF' },
  { icon: FiBarChart2, title: 'Smart Statistics', desc: 'Beautiful charts and insights to visualize your fitness journey.', color: '#00D9A6' },
  { icon: FiCpu, title: 'AI Coach', desc: 'Get personalized recommendations powered by artificial intelligence.', color: '#FF6B6B' },
];

const FloatingIcon = ({ icon: Icon, className, delay = 0 }) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
      <Icon className="w-7 h-7 text-primary" />
    </div>
  </motion.div>
);

const LandingPage = () => {
  const { logIn, token } = useContext(AuthContext);
  const navigate = useNavigate();

  if (token) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitPulse
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => logIn()}>Sign In</Button>
      </header>

      {/* Hero  */}
      <section className="relative px-6 sm:px-12 pt-12 pb-32 lg:pt-20 lg:pb-40">
        {/* Floating Icons */}
        <FloatingIcon icon={FiActivity} className="top-20 right-[15%] hidden lg:flex" delay={0} />
        <FloatingIcon icon={BiCycling} className="top-40 right-[30%] hidden lg:flex" delay={1.5} />
        <FloatingIcon icon={FiHeart} className="bottom-32 right-[20%] hidden lg:flex" delay={3} />

        {/* BG Gradient Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-sm text-slate-300">AI-Powered Fitness Platform</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Elevate Your </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Fitness Journey
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Track workouts, analyze performance, and get AI-powered coaching — all in one beautiful platform built for athletes.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={FiArrowRight} onClick={() => logIn()}>
              Get Started Free
            </Button>
            <Button variant="ghost" size="lg" onClick={() => logIn()}>
              Learn More
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={fadeInUp} className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '1M+', label: 'Workouts Tracked' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features  */}
      <section className="relative px-6 sm:px-12 pb-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Powerful features designed to help you achieve your fitness goals faster.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-8 text-center group"
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-shadow duration-300"
                  style={{
                    background: `${feature.color}15`,
                    boxShadow: `0 0 0 rgba(0,0,0,0)`,
                  }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA  */}
      <section className="relative px-6 sm:px-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-slate-400 mb-8 relative z-10">
            Join thousands of athletes who trust FitPulse for their fitness journey.
          </p>
          <Button size="lg" icon={FiArrowRight} onClick={() => logIn()} className="relative z-10">
            Start Now — It&apos;s Free
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 sm:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FiZap className="w-4 h-4 text-primary" />
            <span className="text-sm text-slate-500">FitPulse &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-sm text-slate-600">Built with passion for fitness enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
