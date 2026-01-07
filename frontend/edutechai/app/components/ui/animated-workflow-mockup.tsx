"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Upload, MessageSquare, Lightbulb, FileText, Sparkles, CheckCircle, BookOpen, Send, FileCheck } from "lucide-react";
import { useState, useEffect } from "react";

type AnimationStage = 
  | 'upload' 
  | 'textbook-stored' 
  | 'prompt-input' 
  | 'typing' 
  | 'submitting' 
  | 'extracting' 
  | 'packets-flowing' 
  | 'answer-displaying';

export function AnimatedWorkflowMockup() {
  const [stage, setStage] = useState<AnimationStage>('upload');
  const [typedText, setTypedText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [showTextbook, setShowTextbook] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [packets, setPackets] = useState<Array<{ id: number; color: string; delay: number }>>([]);

  const fullPrompt = "What is photosynthesis?";
  const sampleAnswer = "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. This occurs in the chloroplasts of plant cells.";

  useEffect(() => {
    let isMounted = true;

    const cycle = async () => {
      if (!isMounted) return;

      // Stage 1: Upload (2.5 seconds)
      setStage('upload');
      setShowTextbook(false);
      setShowPromptInput(false);
      setTypedText('');
      setAnswerText('');
      setPackets([]);
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (!isMounted) return;

      // Stage 2: Textbook stored in library (2 seconds)
      setStage('textbook-stored');
      setShowTextbook(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isMounted) return;

      // Stage 3: Prompt input appears (1.5 seconds)
      setStage('prompt-input');
      setShowPromptInput(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!isMounted) return;

      // Stage 4: User typing prompt (3.5 seconds)
      setStage('typing');
      setTypedText('');
      for (let i = 0; i <= fullPrompt.length; i++) {
        if (!isMounted) return;
        setTypedText(fullPrompt.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 80));
      }
      await new Promise(resolve => setTimeout(resolve, 800));

      if (!isMounted) return;

      // Stage 5: Submitting (1 second)
      setStage('submitting');
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!isMounted) return;

      // Stage 6: Extracting/Processing (1.5 seconds)
      setStage('extracting');
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!isMounted) return;

      // Stage 7: Packets flowing from textbook (2.5 seconds)
      setStage('packets-flowing');
      const packetColors = ['#3b82f6', '#ef4444', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];
      const newPackets = packetColors.map((color, i) => ({
        id: i,
        color,
        delay: i * 0.2,
      }));
      setPackets(newPackets);
      await new Promise(resolve => setTimeout(resolve, 2500));

      if (!isMounted) return;

      // Stage 8: Answer displaying (4 seconds)
      setStage('answer-displaying');
      setAnswerText('');
      setPackets([]);
      for (let i = 0; i <= sampleAnswer.length; i++) {
        if (!isMounted) return;
        setAnswerText(sampleAnswer.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 35));
      }
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Loop back to upload
      if (isMounted) {
        setStage('upload');
        setShowTextbook(false);
        setShowPromptInput(false);
        setTypedText('');
        setAnswerText('');
        setPackets([]);
      }
    };

    cycle();
    const interval = setInterval(() => {
      if (isMounted) cycle();
    }, 20000); // Total cycle time

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
      {/* Mockup Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
        </div>
        <div className="flex-1 h-8 bg-slate-700/50 rounded-lg mx-4"></div>
      </div>

      {/* Animated Content */}
      <div className="space-y-4 relative">
        <AnimatePresence mode="wait">
          {/* Upload Stage */}
          {stage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/30"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Upload className="w-14 h-14 text-purple-400 mx-auto mb-4" />
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 2, delay: 0.3 }}
                  className="h-2.5 bg-purple-500/40 rounded-full mb-2"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.8, delay: 0.6 }}
                  className="h-2 bg-purple-400/30 rounded-full"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-white/70 text-sm mt-4 font-medium"
                >
                  Drop your PDF here
                </motion.p>
              </div>
            </motion.div>
          )}

          {/* Textbook Stored Stage */}
          {stage === 'textbook-stored' && showTextbook && (
            <motion.div
              key="textbook-stored"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/40"
                >
                  <FileCheck className="w-5 h-5 text-blue-400" />
                </motion.div>
                <div className="flex-1">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2 mb-1"
                  >
                    <BookOpen className="w-4 h-4 text-green-400" />
                    <span className="text-white/90 text-sm font-semibold">Biology_Textbook.pdf</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xs text-white/60"
                  >
                    Uploaded successfully • 300 pages
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Prompt Input & Typing Stages */}
          {(stage === 'prompt-input' || stage === 'typing' || stage === 'submitting') && showPromptInput && (
            <motion.div
              key="prompt-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-600/30">
                    {stage === 'typing' || stage === 'submitting' ? (
                      <span className="text-white/90 text-sm">
                        {typedText}
                        {stage === 'typing' && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block w-0.5 h-4 bg-white ml-1 align-middle"
                          />
                        )}
                      </span>
                    ) : (
                      <span className="text-white/40 text-sm">Type your question...</span>
                    )}
                  </div>
                  {stage === 'typing' && typedText.length > 0 && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  )}
                  {stage === 'submitting' && (
                    <motion.button
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Extracting Stage */}
          {stage === 'extracting' && (
            <motion.div
              key="extracting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
                <div className="flex-1">
                  <div className="text-white/80 text-sm font-medium mb-1">Processing your question...</div>
                  <div className="text-xs text-white/50">Searching in textbook</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Packets Flowing Stage */}
          {stage === 'packets-flowing' && (
            <motion.div
              key="packets-flowing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-slate-700/50 rounded-2xl p-6 border border-slate-600/30 min-h-[200px]"
            >
              {/* Textbook Icon (Source) */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center border-2 border-blue-400/50"
                >
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </motion.div>
              </div>

              {/* Packets/Text flowing from textbook to answer area */}
              {packets.map((packet, index) => (
                <motion.div
                  key={packet.id}
                  initial={{ 
                    x: 60, 
                    y: '50%',
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{ 
                    x: 'calc(100% - 120px)',
                    y: '50%',
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.8],
                  }}
                  transition={{
                    delay: packet.delay,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                  className="absolute"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${packet.color}40`, border: `2px solid ${packet.color}` }}
                  >
                    <FileText className="w-4 h-4" style={{ color: packet.color }} />
                  </motion.div>
                </motion.div>
              ))}

              {/* Answer Area (Destination) */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border-2 border-green-400/50"
                >
                  <Lightbulb className="w-6 h-6 text-green-400" />
                </motion.div>
              </div>

              {/* Connecting line */}
              <div className="absolute left-24 top-1/2 -translate-y-1/2 w-[calc(100%-12rem)] h-0.5 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-green-400/30"></div>
            </motion.div>
          )}

          {/* Answer Displaying Stage */}
          {stage === 'answer-displaying' && (
            <motion.div
              key="answer-displaying"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-700/50 rounded-2xl p-4 border border-slate-600/30"
            >
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-full flex items-center justify-center border border-green-500/30">
                  <Lightbulb className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-white/90 text-sm leading-relaxed">
                    {answerText}
                    {stage === 'answer-displaying' && answerText.length < sampleAnswer.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-white ml-1 align-middle"
                      />
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                    className="mt-3 flex items-center gap-2"
                  >
                    <div className="px-2.5 py-1 bg-green-500/20 rounded-md border border-green-500/30 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Page 42</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
