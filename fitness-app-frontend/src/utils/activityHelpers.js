import { FiActivity, FiZap, FiWind, FiTarget, FiHeart } from 'react-icons/fi';
import { BiCycling, BiSwim } from 'react-icons/bi';
import { GiWeightLiftingUp, GiMeditation, GiJumpingRope } from 'react-icons/gi';

export const ACTIVITY_TYPES = [
  { value: 'RUNNING', label: 'Running', icon: FiActivity, color: '#6C63FF', gradient: 'from-[#6C63FF] to-[#4A42DB]' },
  { value: 'CYCLING', label: 'Cycling', icon: BiCycling, color: '#00D9A6', gradient: 'from-[#00D9A6] to-[#00B88C]' },
  { value: 'SWIMMING', label: 'Swimming', icon: BiSwim, color: '#00B4D8', gradient: 'from-[#00B4D8] to-[#0077B6]' },
  { value: 'WALKING', label: 'Walking', icon: FiWind, color: '#F4A261', gradient: 'from-[#F4A261] to-[#E76F51]' },
  { value: 'WEIGHT_TRAINING', label: 'Weight Training', icon: GiWeightLiftingUp, color: '#FF6B6B', gradient: 'from-[#FF6B6B] to-[#EE4444]' },
  { value: 'YOGA', label: 'Yoga', icon: GiMeditation, color: '#A78BFA', gradient: 'from-[#A78BFA] to-[#7C3AED]' },
  { value: 'HIIT', label: 'HIIT', icon: FiZap, color: '#FBBF24', gradient: 'from-[#FBBF24] to-[#F59E0B]' },
  { value: 'CARDIO', label: 'Cardio', icon: FiHeart, color: '#F472B6', gradient: 'from-[#F472B6] to-[#EC4899]' },
  { value: 'STRETCHING', label: 'Stretching', icon: GiJumpingRope, color: '#34D399', gradient: 'from-[#34D399] to-[#10B981]' },
  { value: 'OTHER', label: 'Other', icon: FiTarget, color: '#94A3B8', gradient: 'from-[#94A3B8] to-[#64748B]' },
];

export const getActivityConfig = (type) =>
  ACTIVITY_TYPES.find(a => a.value === type) || ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];

export const formatDuration = (mins) => {
  if (!mins) return '0 min';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch { return 'Invalid date'; }
};

export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};
