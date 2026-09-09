import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING DUAL-LOOP FOC MOTOR DRIVERS...',
  'CALIBRATING 9-DOF IMU SENSOR FUSION...',
  'SOLVING INVERSE KINEMATICS MATRIX...',
  'CONNECTING ROS 2 HUMBLE MICRO-XRCE BRIDGE...',
  'CALIBRATING SOLIDWORKS CAD GEOMETRY...',
  'SYSTEM INTEGRITY VERIFIED // 100% READY',
];

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState<number>(0);
  const [logIndex, setLogIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(sessionStorage.getItem('kp_preloader_seen'));
  });

  useEffect(() => {
    if (isDone) {
      onComplete?.();
      return;
    }

    const startTime = Date.now();
    const duration = 1400; // 1.4 seconds total sequence

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Non-linear easing
      const eased = Math.floor(Math.min(100, Math.pow(progress, 0.85) * 100));
      setPercent(eased);

      const nextLog = Math.min(Math.floor(progress * BOOT_LOGS.length), BOOT_LOGS.length - 1);
      setLogIndex(nextLog);

      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          sessionStorage.setItem('kp_preloader_seen', 'true');
          setTimeout(() => {
            setIsDone(true);
            onComplete?.();
          }, 600);
        }, 200);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    sessionStorage.setItem('kp_preloader_seen', 'true');
    setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, 300);
  };

  if (isDone) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#020712] text-white transition-all duration-700 select-none cursor-pointer ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-label="System Initializing"
    >
      {/* Background blueprint grid & ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(38,121,170,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(38,121,170,0.2) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Centerpiece Monogram HUD */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Concentric rotating radar rings */}
        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border border-cyan-400/20 border-dashed animate-spin-slow"
            style={{ animationDuration: '18s' }}
          />
          <div
            className="absolute inset-2 rounded-full border border-sky-400/30"
          />
          <div
            className="absolute inset-[-8px] rounded-full border border-cyan-300/10 border-dotted"
            style={{ animation: 'spin 30s linear infinite reverse' }}
          />

          {/* Central Logo / Initials */}
          <div className="w-16 h-16 rounded-2xl bg-[#061426] border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.35)] overflow-hidden">
            <img
              src="/logo.png"
              alt="KP"
              className="w-full h-full object-cover p-1"
            />
          </div>

          {/* Corner crosshairs */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
        </div>

        {/* Identity Title */}
        <div className="text-[11px] font-mono tracking-[0.35em] text-cyan-400 uppercase mb-2">
          KULASEKARA PANDIAN K R
        </div>
        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">
          MECHATRONICS & ROBOTICS ARCHITECTURE
        </div>

        {/* Progress Bar & Numerical Counter */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">CALIBRATING SYSTEMS</span>
            <span className="text-cyan-300 font-bold">{percent}%</span>
          </div>

          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(34,211,238,0.75)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Real-time telemetry log */}
        <div className="mt-5 h-6 flex items-center justify-center font-mono text-[10px] tracking-wider text-cyan-300/80">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2" />
          <span>{BOOT_LOGS[logIndex]}</span>
        </div>

        {/* Skip prompt */}
        <div className="mt-8 text-[9px] font-mono text-slate-600 tracking-widest uppercase hover:text-slate-400 transition-colors">
          CLICK ANYWHERE TO SKIP
        </div>
      </div>
    </div>
  );
};
