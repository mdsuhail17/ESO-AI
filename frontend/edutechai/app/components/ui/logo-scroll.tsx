"use client";

import { motion } from "framer-motion";

const integrations = [
  { name: "Slack", icon: "💬", color: "bg-[#4A154B]/20" },
  { name: "Microsoft Teams", icon: "👥", color: "bg-[#5059C9]/20" },
  { name: "Google Docs", icon: "📄", color: "bg-[#4285F4]/20" },
  { name: "Google Calendar", icon: "📅", color: "bg-[#34A853]/20" },
  { name: "Notion", icon: "📝", color: "bg-white/10" },
  { name: "Dropbox", icon: "📦", color: "bg-[#0061FF]/20" },
  { name: "OneDrive", icon: "☁️", color: "bg-[#0078D4]/20" },
  { name: "Zoom", icon: "🎥", color: "bg-[#2D8CFF]/20" },
  { name: "Canvas LMS", icon: "🎓", color: "bg-[#E03C31]/20" },
  { name: "Moodle", icon: "📚", color: "bg-[#F98012]/20" },
];

export function LogoScroll() {
  return (
    <section className="relative py-12 bg-[#030303] overflow-hidden">
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#030303] to-transparent z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm text-white/40 mb-8 tracking-wide">
          Seamlessly integrates with your favorite tools
        </p>

        {/* Scrolling container */}
        <div className="relative">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030303] to-transparent z-10" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030303] to-transparent z-10" />

          {/* Scrolling logos */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: [0, -2400],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 35,
                  ease: "linear",
                },
              }}
            >
              {/* First set */}
              {integrations.map((item, index) => (
                <div
                  key={`first-${index}`}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] whitespace-nowrap hover:bg-white/[0.06] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-white/50 font-medium text-sm">
                    {item.name}
                  </span>
                </div>
              ))}
              {/* Second set for seamless loop */}
              {integrations.map((item, index) => (
                <div
                  key={`second-${index}`}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] whitespace-nowrap hover:bg-white/[0.06] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-white/50 font-medium text-sm">
                    {item.name}
                  </span>
                </div>
              ))}
              {/* Third set for extra coverage */}
              {integrations.map((item, index) => (
                <div
                  key={`third-${index}`}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] whitespace-nowrap hover:bg-white/[0.06] transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className="text-white/50 font-medium text-sm">
                    {item.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#030303] to-transparent z-10" />
    </section>
  );
}
