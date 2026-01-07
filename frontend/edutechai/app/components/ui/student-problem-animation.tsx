"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, Search } from "lucide-react";
import { useState, useEffect } from "react";

export function StudentProblemAnimation() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeInterval: NodeJS.Timeout;
    let isMounted = true;

    const cycle = async () => {
      // Reset
      setCurrentPage(1);
      setIsSearching(false);
      setTimeElapsed(0);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Start searching - flipping through pages
      setIsSearching(true);
      let page = 1;
      let time = 0;

      // Simulate 2 hours of searching (compressed to ~15 seconds for animation)
      const totalPages = 300;
      const searchDuration = 15000; // 15 seconds for animation
      const pagesPerSecond = totalPages / (searchDuration / 1000);

      const startTime = Date.now();
      timeInterval = setInterval(() => {
        if (!isMounted) return;
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeElapsed(Math.min(elapsed * 120, 120)); // Scale: 1 second = 2 hours
      }, 100);

      interval = setInterval(() => {
        if (!isMounted) return;
        page += Math.floor(pagesPerSecond * 0.1);
        if (page > totalPages) {
          page = 1; // Loop back
        }
        setCurrentPage(page);
      }, 100);

      await new Promise(resolve => setTimeout(resolve, searchDuration));

      // Stop searching
      setIsSearching(false);
      if (interval) clearInterval(interval);
      if (timeInterval) clearInterval(timeInterval);
      
      // Wait before restarting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isMounted) {
        setCurrentPage(1);
        setTimeElapsed(0);
      }
    };

    cycle();
    const mainInterval = setInterval(() => {
      if (isMounted) cycle();
    }, 18000); // Total cycle time

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
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
          animate={{ rotate: isSearching ? 360 : 0 }}
          transition={{ duration: 2, repeat: isSearching ? Infinity : 0, ease: "linear" }}
        >
          <Clock className="w-6 h-6 text-red-400" />
        </motion.div>
        <div className="absolute -bottom-1 -right-1 text-xs text-red-400 font-bold bg-red-500/30 px-1.5 py-0.5 rounded">
          {formatTime(timeElapsed)}
        </div>
      </div>

      {/* Textbook with flipping pages */}
      <div className="relative">
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
          <BookOpen className="w-32 h-32 text-white/30" />
          
          {/* Page flip effect */}
          {isSearching && (
            <motion.div
              initial={{ rotateY: 0, x: 0 }}
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
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="w-16 h-20 bg-white/20 rounded-sm border border-white/30" style={{ transform: "rotateY(90deg)" }} />
            </motion.div>
          )}
        </motion.div>

        {/* Search icon moving around */}
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Search className="w-8 h-8 text-yellow-400/60" />
          </motion.div>
        )}

        {/* Page numbers changing */}
        {isSearching && (
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 px-3 py-1 rounded border border-white/20"
          >
            <span className="text-xs text-white/60 font-mono">Page {currentPage}/300</span>
          </motion.div>
        )}
      </div>

      {/* Frustration indicator - question marks */}
      {isSearching && (
        <>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0,
            }}
            className="absolute top-8 left-8 text-2xl text-white/40"
          >
            ?
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.7,
            }}
            className="absolute top-12 right-12 text-2xl text-white/40"
          >
            ?
          </motion.div>
          <motion.div
            animate={{
              opacity: [0, 1, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.4,
            }}
            className="absolute bottom-8 left-12 text-2xl text-white/40"
          >
            ?
          </motion.div>
        </>
      )}
    </div>
  );
}


