import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useNavigate } from 'react-router';
import { FiUser, FiMail, FiLogOut, FiShield, FiCalendar } from 'react-icons/fi';
import { staggerContainer, fadeInUp } from '../utils/animations';
import PageWrapper from '../components/ui/PageWrapper';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const Profile = () => {
  const { tokenData, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate('/');
  };

  const username = tokenData?.preferred_username || 'User';
  const email = tokenData?.email || 'Not available';
  const name = tokenData?.name || tokenData?.preferred_username || 'User';

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-2xl mx-auto">
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account</p>
        </motion.div>

        {/* Avatar Card */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="flex flex-col items-center py-10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold mb-4 relative z-10 shadow-lg shadow-primary/30">
              {username[0]?.toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-white relative z-10">{name}</h2>
            <p className="text-slate-400 text-sm mt-1 relative z-10">{email}</p>
          </GlassCard>
        </motion.div>

        {/* Details */}
        <motion.div variants={fadeInUp}>
          <GlassCard hover={false} className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-5">Account Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Username</p>
                  <p className="text-sm text-white font-medium">{username}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-white font-medium">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Authentication</p>
                  <p className="text-sm text-white font-medium">Keycloak SSO</p>
                </div>
              </div>
              {tokenData?.sub && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <FiCalendar className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">User ID</p>
                    <p className="text-sm text-white font-medium font-mono text-xs">{tokenData.sub}</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Logout */}
        <motion.div variants={fadeInUp} className="text-center">
          <Button variant="accent" icon={FiLogOut} onClick={handleLogout}>
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};

export default Profile;
