"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Clock, Search, Upload, MessageSquare, Lightbulb, FileText, Presentation, GraduationCap, Download, Sparkles, CheckCircle, Copy } from "lucide-react";
import { useState, useEffect } from "react";

type StoryStage = 
  | 'student-problem' 
  | 'student-solution' 
  | 'lecturer-problem' 
  | 'lecturer-solution';

export function BackgroundAnimatedStory() {
  const [stage, setStage] = useState<StoryStage>('student-problem');
  const [studentPage, setStudentPage] = useState(1);
  const [studentTime, setStudentTime] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [lecturerTime, setLecturerTime] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [copiedText, setCopiedText] = useState('');

  const question = "What is photosynthesis?";
  const answer = "Photosynthesis is the process by which plants convert light energy into chemical energy.";
  const sampleText = "Photosynthesis is the process...";

  useEffect(() => {
    let isMounted = true;
    let studentTimeInterval: NodeJS.Timeout;
    let lecturerTimeInterval: NodeJS.Timeout;

    const cycle = async () => {
      if (!isMounted) return;

      // ========== STUDENT PROBLEM (8 seconds) ==========
      setStage('student-problem');
      setStudentPage(1);
      setStudentTime(0);
      setIsSearching(true);
      setTypedQuestion('');
      setAnswerText('');
      setSlideCount(0);
      setCopiedText('');

      const startTime = Date.now();
      studentTimeInterval = setInterval(() => {
        if (!isMounted) return;
        const elapsed = (Date.now() - startTime) / 1000;
        setStudentTime(Math.min(elapsed * 15, 120)); // Scale: 1 second = 15 minutes, max 2 hours
      }, 100);

      // Simulate page flipping
      let page = 1;
      const pageInterval = setInterval(() => {
        if (!isMounted) return;
        page += Math.floor(Math.random() * 3) + 1;
        if (page > 300) page = 1;
        setStudentPage(page);
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 8000));
      clearInterval(pageInterval);
      if (studentTimeInterval) clearInterval(studentTimeInterval);
      setIsSearching(false);

      if (!isMounted) return;

      // ========== STUDENT SOLUTION (10 seconds) ==========
      setStage('student-solution');
      setStudentTime(0);
      setStudentPage(1);

      // Upload animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Typing question
      setTypedQuestion('');
      for (let i = 0; i <= question.length; i++) {
        if (!isMounted) return;
        setTypedQuestion(question.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Answer appearing
      setAnswerText('');
      for (let i = 0; i <= answer.length; i++) {
        if (!isMounted) return;
        setAnswerText(answer.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isMounted) return;

      // ========== LECTURER PROBLEM (8 seconds) ==========
      setStage('lecturer-problem');
      setLecturerTime(0);
      setSlideCount(0);
      setCopiedText('');

      const lecturerStartTime = Date.now();
      lecturerTimeInterval = setInterval(() => {
        if (!isMounted) return;
        const elapsed = (Date.now() - lecturerStartTime) / 1000;
        setLecturerTime(Math.min(elapsed * 15, 120)); // Scale: 1 second = 15 minutes, max 2 hours
      }, 100);

      // Reading textbook
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Copying text
      setCopiedText('');
      for (let i = 0; i <= sampleText.length; i++) {
        if (!isMounted) return;
        setCopiedText(sampleText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 80));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Creating slides
      for (let i = 0; i <= 10; i++) {
        if (!isMounted) return;
        setSlideCount(i);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (lecturerTimeInterval) clearInterval(lecturerTimeInterval);

      if (!isMounted) return;

      // ========== LECTURER SOLUTION (8 seconds) ==========
      setStage('lecturer-solution');
      setLecturerTime(0);
      setSlideCount(0);
      setCopiedText('');

      // Switch to lecture mode
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate lecture
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Download PDF/Slides
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Success
      await new Promise(resolve => setTimeout(resolve, 2500));
    };

    cycle();
    const mainInterval = setInterval(() => {
      if (isMounted) cycle();
    }, 34000); // Total cycle time: 34 seconds

    return () => {
      isMounted = false;
      if (studentTimeInterval) clearInterval(studentTimeInterval);
      if (lecturerTimeInterval) clearInterval(lecturerTimeInterval);
      clearInterval(mainInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 60);
    const mins = Math.floor(seconds % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Dark overlay for better visibility */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* STUDENT PROBLEM */}
          {stage === 'student-problem' && (
            <motion.div
              key="student-problem"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex items-center gap-8">
                {/* Textbook with flipping pages */}
                <motion.div
                  animate={{
                    rotateY: isSearching ? [0, 15, 0, -15, 0] : 0,
                    scale: isSearching ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: isSearching ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <BookOpen className="w-32 h-32 text-blue-500" />
                  {isSearching && (
                    <motion.div
                      animate={{
                        rotateY: [0, 180, 360],
                        x: [0, 20, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-16 h-20 bg-white/20 rounded-sm" style={{ transform: "rotateY(90deg)" }} />
                    </motion.div>
                  )}
                </motion.div>

                {/* Search icon moving */}
                {isSearching && (
                  <motion.div
                    animate={{
                      x: [0, 40, -40, 0],
                      y: [0, -30, 30, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Search className="w-12 h-12 text-yellow-500" />
                  </motion.div>
                )}

                {/* Clock showing wasted time */}
                <div className="relative">
                  <motion.div
                    animate={{ rotate: isSearching ? 360 : 0 }}
                    transition={{ duration: 2, repeat: isSearching ? Infinity : 0, ease: "linear" }}
                  >
                    <Clock className="w-16 h-16 text-red-500" />
                  </motion.div>
                  <div className="absolute -bottom-2 -right-2 bg-red-600/80 px-2 py-1 rounded text-xs text-white font-bold">
                    {formatTime(studentTime)}
                  </div>
                </div>
              </div>

              {/* Page counter */}
              {isSearching && (
                <motion.div
                  key={studentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/30 px-4 py-2 rounded border border-white/60 shadow-lg"
                >
                  <span className="text-sm text-white font-mono font-semibold">Page {studentPage}/300</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STUDENT SOLUTION */}
          {stage === 'student-solution' && (
            <motion.div
              key="student-solution"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-8"
            >
              {/* Upload */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center"
              >
                <Upload className="w-16 h-16 text-blue-500 mb-2" />
                <div className="w-24 h-2 bg-blue-500 rounded-full"></div>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-2xl text-white font-bold">→</span>
              </motion.div>

              {/* Question */}
              <div className="flex flex-col items-center gap-2">
                <MessageSquare className="w-12 h-12 text-white" />
                <div className="bg-white/30 px-3 py-1 rounded border border-white/60 max-w-xs shadow-lg">
                  <span className="text-xs text-white font-medium">
                    {typedQuestion}
                    {typedQuestion.length < question.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-3 bg-white ml-1"
                      />
                    )}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <span className="text-2xl text-white font-bold">→</span>
              </motion.div>

              {/* AI Answer */}
              <div className="flex flex-col items-center gap-2">
                <Lightbulb className="w-12 h-12 text-green-500" />
                <div className="bg-white/30 px-3 py-1 rounded border border-white/60 max-w-xs shadow-lg">
                  <span className="text-xs text-white font-medium">
                    {answerText}
                    {answerText.length < answer.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-3 bg-white ml-1"
                      />
                    )}
                  </span>
                </div>
              </div>

              {/* Success checkmark */}
              {answerText.length === answer.length && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* LECTURER PROBLEM */}
          {stage === 'lecturer-problem' && (
            <motion.div
              key="lecturer-problem"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-6"
            >
              {/* Reading textbook */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="w-20 h-20 text-blue-500" />
              </motion.div>

              {/* Copying */}
              <motion.div
                animate={{ x: [0, 30, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Copy className="w-12 h-12 text-yellow-500" />
              </motion.div>

              {/* Creating slides */}
              <div className="relative">
                <Presentation className="w-20 h-20 text-red-500" />
                {slideCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-600/80 px-2 py-1 rounded text-xs text-white font-bold">
                    {slideCount}
                  </div>
                )}
              </div>

              {/* Clock showing wasted time */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className="w-16 h-16 text-red-500" />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-red-600/80 px-2 py-1 rounded text-xs text-white font-bold">
                  {formatTime(lecturerTime)}
                </div>
              </div>
            </motion.div>
          )}

          {/* LECTURER SOLUTION */}
          {stage === 'lecturer-solution' && (
            <motion.div
              key="lecturer-solution"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-6"
            >
              {/* Switch to lecture mode */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <GraduationCap className="w-16 h-16 text-blue-500 mb-2" />
                <span className="text-xs text-white">Lecture Mode</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-2xl text-white font-bold">→</span>
              </motion.div>

              {/* AI Generating */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="flex flex-col items-center"
              >
                <Sparkles className="w-16 h-16 text-yellow-500 mb-2" />
                <span className="text-xs text-white">Generating...</span>
              </motion.div>

              {/* Arrow */}
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                <span className="text-2xl text-white font-bold">→</span>
              </motion.div>

              {/* Download PDF/Slides */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center gap-2"
              >
                <Download className="w-16 h-16 text-green-500" />
                <FileText className="w-12 h-12 text-green-500 -mt-2" />
                <span className="text-xs text-white">Ready!</span>
              </motion.div>

              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-400/60"
              >
                <CheckCircle className="w-12 h-12 text-green-500" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

