import React, { useEffect, useState } from 'react';

const ProgressRing = ({ radius = 60, stroke = 6, progress = 0, color = '#6C63FF', label, value, unit }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(Math.min(progress, 100)), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="rgba(255,255,255,0.06)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="progress-ring-circle"
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            filter={`drop-shadow(0 0 6px ${color}40)`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{value}</span>
          {unit && <span className="text-xs text-slate-400">{unit}</span>}
        </div>
      </div>
      {label && <span className="text-sm text-slate-400">{label}</span>}
    </div>
  );
};

export default ProgressRing;
