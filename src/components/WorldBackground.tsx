import { motion } from 'framer-motion';

export default function WorldBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
      
      {/* Animated floating dots */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5"
          style={{
            width: Math.random() * 4 + 1,
            height: Math.random() * 4 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Globe grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={`h-${i}`}
            cx="500" cy="500"
            rx={400}
            ry={400 * Math.cos((i * 15 * Math.PI) / 180)}
            fill="none" stroke="white" strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={`v-${i}`}
            cx="500" cy="500"
            rx={400 * Math.cos((i * 15 * Math.PI) / 180)}
            ry={400}
            fill="none" stroke="white" strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
    </div>
  );
}
