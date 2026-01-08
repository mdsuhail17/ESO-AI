"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, BookOpen, Clock, Search, FileText, X, AlertCircle } from "lucide-react";

const tabs = [
  {
    id: "students",
    label: "Students",
    icon: GraduationCap,
    title: "Hours lost searching",
    description: "Flipping through 300+ pages just to find one answer. Spending hours locating topics before you can even start studying.",
    stats: [
      { value: "2-3", unit: "hrs", label: "searching" },
      { value: "300", unit: "+", label: "pages" },
      { value: "40", unit: "%", label: "time lost" },
    ],
  },
  {
    id: "teachers",
    label: "Teachers",
    icon: BookOpen,
    title: "Lecture prep takes forever",
    description: "Manually searching textbooks, extracting key points, simplifying content. Hours spent preparing every single lecture.",
    stats: [
      { value: "4-5", unit: "hrs", label: "per lecture" },
      { value: "50", unit: "+", label: "sources" },
      { value: "60", unit: "%", label: "manual work" },
    ],
  },
];

// Mock search results that show frustration
const studentSearchItems = [
  { text: "Photosynthesis process...", page: "pg. 127", match: false },
  { text: "Light reactions in...", page: "pg. 203", match: false },
  { text: "Calvin cycle overview", page: "pg. 89", match: false },
  { text: "Chloroplast structure", page: "pg. 156", match: true },
  { text: "Energy conversion in...", page: "pg. 312", match: false },
];

const teacherTasks = [
  { text: "Extract key concepts", done: true },
  { text: "Simplify for students", done: true },
  { text: "Create slide outline", done: false, current: true },
  { text: "Find relevant examples", done: false },
  { text: "Prepare quiz questions", done: false },
];

export function ProblemSection() {
  const [activeTab, setActiveTab] = useState("students");
  const activeData = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="problem" className="py-24 md:py-32 px-6 md:px-8 bg-[#030303]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            The daily struggle
          </h2>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex p-1 bg-white/[0.03] rounded-full border border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/[0.08] rounded-full border border-white/[0.1]"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid lg:grid-cols-5 gap-8 items-center"
            >
            {/* Left - Text Content */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
                {activeData.title}
              </h3>
              <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-8">
                {activeData.description}
              </p>

              {/* Stats - horizontal */}
              <div className="flex gap-8">
                {activeData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {stat.value}
                      <span className="text-white/30 font-medium">{stat.unit}</span>
                    </div>
                    <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right - Interactive Visual */}
            <div className="lg:col-span-3">
              {activeTab === "students" ? (
                <StudentVisual />
              ) : (
                <TeacherVisual />
              )}
            </div>
          </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function StudentVisual() {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Mock browser/app header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 mx-8">
          <div className="bg-white/[0.05] rounded-md px-3 py-1.5 text-xs text-white/30 flex items-center gap-2">
            <Search className="w-3 h-3" />
            <span>Search in textbook...</span>
          </div>
        </div>
      </div>

      {/* Search content */}
      <div className="p-4">
        {/* Search query */}
        <div className="flex items-center gap-2 mb-4 p-3 bg-white/[0.03] rounded-lg border border-white/[0.06]">
          <Search className="w-4 h-4 text-white/30" />
          <span className="text-white/60 text-sm">How does photosynthesis work?</span>
          <motion.div
            className="w-0.5 h-4 bg-indigo-400 ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </div>

        {/* Results */}
        <div className="space-y-2">
          {studentSearchItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                item.match
                  ? "bg-indigo-500/10 border-indigo-500/20"
                  : "bg-white/[0.02] border-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-4 h-4 ${item.match ? "text-indigo-400" : "text-white/20"}`} />
                <span className={`text-sm ${item.match ? "text-white/80" : "text-white/40"}`}>
                  {item.text}
                </span>
              </div>
              <span className="text-xs text-white/20">{item.page}</span>
            </motion.div>
          ))}
        </div>

        {/* Frustration indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-2 mt-4 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10"
        >
          <Clock className="w-4 h-4 text-amber-500/60" />
          <span className="text-xs text-amber-500/60">15 minutes searching... still not the right answer</span>
        </motion.div>
      </div>
    </div>
  );
}

function TeacherVisual() {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Mock app header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-white/30" />
          <span className="text-sm text-white/50">Lecture: Cell Biology</span>
        </div>
        <div className="text-xs text-white/30">Draft</div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-white/40">Preparation tasks</span>
          <span className="text-xs text-white/30">2 of 5 done</span>
        </div>

        {/* Task list */}
        <div className="space-y-2 mb-4">
          {teacherTasks.map((task, index) => (
            <motion.div
              key={task.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                task.current
                  ? "bg-indigo-500/10 border-indigo-500/20"
                  : "bg-white/[0.02] border-white/[0.04]"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                task.done
                  ? "bg-green-500/20 border-green-500/40"
                  : task.current
                    ? "border-indigo-500/40"
                    : "border-white/10"
              }`}>
                {task.done && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                  />
                )}
                {task.current && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                  />
                )}
              </div>
              <span className={`text-sm ${
                task.done ? "text-white/30 line-through" : task.current ? "text-white/80" : "text-white/40"
              }`}>
                {task.text}
              </span>
              {task.current && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs text-indigo-400 ml-auto"
                >
                  in progress...
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 p-3 bg-rose-500/5 rounded-lg border border-rose-500/10"
        >
          <AlertCircle className="w-4 h-4 text-rose-500/60" />
          <span className="text-xs text-rose-500/60">2 hours in, 3 more tasks remaining</span>
        </motion.div>
      </div>
    </div>
  );
}
