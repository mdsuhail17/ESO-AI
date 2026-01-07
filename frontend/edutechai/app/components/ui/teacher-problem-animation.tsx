"use client";

import { motion } from "framer-motion";
import { FileText, Clock, Copy, Presentation, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

export function TeacherProblemAnimation() {
  const [stage, setStage] = useState<'reading' | 'copying' | 'creating'>('reading');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [copiedText, setCopiedText] = useState('');
  const [slideCount, setSlideCount] = useState(0);

  const sampleText = "Photosynthesis is the process...";
  const totalSlides = 15;

  useEffect(() => {
    let isMounted = true;
    let timeInterval: NodeJS.Timeout;

    const cycle = async () => {
      if (!isMounted) return;

      // Stage 1: Reading textbook (3 seconds)
      setStage('reading');
      setTimeElapsed(0);
      setCopiedText('');
      setSlideCount(0);
      
      const startTime = Date.now();
      timeInterval = setInterval(() => {
        if (!isMounted) return;
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeElapsed(Math.min(elapsed * 20, 60)); // Scale: 1 second = 20 minutes
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 3000));

      if (!isMounted) return;

      // Stage 2: Copying text manually (4 seconds)
      setStage('copying');
      setCopiedText('');
      for (let i = 0; i <= sampleText.length; i++) {
        if (!isMounted) return;
        setCopiedText(sampleText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 80));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!isMounted) return;

      // Stage 3: Creating PPT slides (8 seconds)
      setStage('creating');
      for (let i = 0; i <= totalSlides; i++) {
        if (!isMounted) return;
        setSlideCount(i);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (timeInterval) clearInterval(timeInterval);
      
      // Wait before restarting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isMounted) {
        setStage('reading');
        setTimeElapsed(0);
        setCopiedText('');
        setSlideCount(0);
      }
    };

    cycle();
    const mainInterval = setInterval(() => {
      if (isMounted) cycle();
    }, 20000); // Total cycle time

    return () => {
      isMounted = false;
      if (timeInterval) clearInterval(timeInterval);
      clearInterval(mainInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 60);
    const mins = Math.floor(seconds % 60);
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden relative">
      {/* Clock in top right */}
      <div className="absolute top-4 right-4 bg-red-500/20 backdrop-blur-sm rounded-full p-3 border border-red-500/30 z-10">
        <motion.div
          animate={{ rotate: stage !== 'reading' ? 360 : 0 }}
          transition={{ duration: 2, repeat: stage !== 'reading' ? Infinity : 0, ease: "linear" }}
        >
          <Clock className="w-6 h-6 text-red-400" />
        </motion.div>
        <div className="absolute -bottom-1 -right-1 text-xs text-red-400 font-bold bg-red-500/30 px-1.5 py-0.5 rounded">
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Content based on stage */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Reading Stage */}
        {stage === 'reading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <BookOpen className="w-24 h-24 text-blue-400/40" />
            </motion.div>
            <div className="text-center">
              <div className="w-32 h-2 bg-white/10 rounded-full mb-2"></div>
              <div className="w-24 h-2 bg-white/5 rounded-full"></div>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xs text-white/50 mt-2"
            >
              Reading textbook...
            </motion.div>
          </motion.div>
        )}

        {/* Copying Stage */}
        {stage === 'copying' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 w-full px-8"
          >
            {/* Textbook */}
            <motion.div
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <BookOpen className="w-16 h-16 text-blue-400/40" />
            </motion.div>

            {/* Copying animation */}
            <motion.div
              animate={{
                x: [0, 40, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex-1"
            >
              <Copy className="w-8 h-8 text-yellow-400/60 mx-auto" />
            </motion.div>

            {/* Document receiving text */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="relative"
            >
              <FileText className="w-16 h-16 text-green-400/40" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-1 bg-green-400/60 rounded"
              />
            </motion.div>

            {/* Copied text preview */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-3 py-1 rounded border border-white/20 max-w-[80%]">
              <span className="text-xs text-white/60 font-mono truncate block">
                {copiedText || "Copying text..."}
                {stage === 'copying' && copiedText.length < sampleText.length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-3 bg-white ml-1"
                  />
                )}
              </span>
            </div>
          </motion.div>
        )}

        {/* Creating PPT Stage */}
        {stage === 'creating' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Presentation className="w-24 h-24 text-purple-400/50" />
            </motion.div>

            {/* Slide stack animation */}
            <div className="relative">
              {[...Array(Math.min(slideCount, 5))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -i * 2, scale: 1 - i * 0.05 }}
                  className="absolute w-20 h-16 bg-white/10 border border-white/20 rounded-sm"
                  style={{ left: `${i * 2}px`, top: `${i * 2}px` }}
                />
              ))}
            </div>

            {/* Slide count */}
            <motion.div
              key={slideCount}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 px-3 py-1 rounded border border-white/20 mt-2"
            >
              <span className="text-xs text-white/60 font-mono">
                Slide {slideCount}/{totalSlides}
              </span>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Stress indicators */}
      {(stage === 'copying' || stage === 'creating') && (
        <>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0,
            }}
            className="absolute top-6 left-6 text-xl text-red-400/40"
          >
            ⚡
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
            className="absolute bottom-6 right-6 text-xl text-red-400/40"
          >
            ⚡
          </motion.div>
        </>
      )}
    </div>
  );
}

