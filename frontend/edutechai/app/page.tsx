'use client';

import { HeroGeometric } from './components/ui/shape-landing-hero';
import Link from 'next/link';
import { BookOpen, MessageSquare, Lightbulb, FileText, Clock, Share2, CheckCircle, Upload, Search, FileCheck, Users, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import HoverFooter from './components/ui/hover-footer';
import { FeaturesSectionWithHoverEffects } from './components/ui/feature-section-with-hover-effects';
import { AnimatedWorkflowMockup } from './components/ui/animated-workflow-mockup';
import { StudentProblemAnimation } from './components/ui/student-problem-animation';
import { TeacherProblemAnimation } from './components/ui/teacher-problem-animation';
import { BackgroundAnimatedStory } from './components/ui/background-animated-story';
import { FAQ } from './components/ui/faq-section';
import { Navbar } from './components/ui/navbar';
import { TypewriterEffectSmooth } from './components/ui/typewriter-effect';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleTryItClick = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  const handleWatchDemoClick = () => {
    // TODO: Implement watch demo functionality
    console.log('Watch Demo clicked');
  };

  return (
    <main id="top" className="bg-black relative">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} userName={userName} />

      {/* Hero Section */}
      <HeroGeometric
        badge="ESo AI"
        title1="Stop Wasting Hours"
        title2="Searching Textbooks"
        subtitle="Upload your textbook PDF and ask questions instantly. Get exact answers from the book, simplified explanations, and structured notes – saving students and teachers 2+ hours per session."
        onTryItClick={handleTryItClick}
        onWatchDemoClick={handleWatchDemoClick}
      />

      {/* Animated Story Section - Between Hero and Problem */}
      <section className="relative h-[200px] w-full flex items-center justify-center overflow-hidden bg-black py-8">
        <BackgroundAnimatedStory />
      </section>

      {/* Problem Section */}
      <section id="problem" className="pt-8 pb-16 px-6 bg-gradient-to-b from-[#030303] to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/60 mb-6">
              THE PROBLEM
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              The Everyday Struggle<br />
              <span className="bg-gradient-to-r from-white via-gray-400 to-white bg-clip-text text-transparent">
                with Textbooks
              </span>
            </h2>
          </motion.div>

          {/* Split Layout */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Student Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-white/20 transition-all duration-300">
                {/* Animated Video - Student Problem */}
                <div className="mb-8 relative">
                  <StudentProblemAnimation />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <Users className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Students</h3>
                </div>
                
                <p className="text-lg leading-relaxed text-white/70">
                  Tired of flipping through 300+ page textbooks to find one answer? Spending 2 hours just locating topics before you can even study?
                </p>
              </div>
            </motion.div>

            {/* Teacher Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-white/20 transition-all duration-300">
                {/* Animated Video - Teacher Problem */}
                <div className="mb-8 relative">
                  <TeacherProblemAnimation />
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <FileText className="w-6 h-6 text-white/80" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">For Teachers</h3>
                </div>
                
                <p className="text-lg leading-relaxed text-white/70">
                  Preparing notes means manually searching textbooks, extracting points, and simplifying – often taking hours per lecture.
          </p>
        </div>
            </motion.div>
          </div>

          {/* Closing Statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
              <Users className="w-6 h-6 text-white/60" />
              <p className="text-xl text-white/80 font-medium">
                You're not alone – millions face this daily.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-32 px-6 bg-gradient-to-b from-black to-[#030303] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/60 mb-6">
              THE SOLUTION
            </span>
            <div className="mb-6">
              <div className="mb-4">
                <TypewriterEffectSmooth
                  words={[
                    { text: "Your" },
                    { text: "Personal" },
                    { text: "Textbook" },
                    { text: "AI", className: "text-[#3ca2fa]" },
                  ]}
                  className="justify-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                  cursorClassName="bg-[#3ca2fa]"
                />
              </div>
              <div className="flex justify-center">
                <TypewriterEffectSmooth
                  words={[
                    { text: "Simple,", className: "bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent" },
                    { text: "Accurate,", className: "bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent" },
                    { text: "Fast", className: "bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent" },
                  ]}
                  className="justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
                  cursorClassName="bg-[#3ca2fa]"
                />
              </div>
            </div>
          </motion.div>

          {/* Steps with Animated Mockup */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Side - Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="group relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Upload className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-xs font-bold text-black">1</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Upload PDF</h3>
                    <p className="text-lg text-white/70 leading-relaxed">
                      Drag and drop your full textbook (or syllabus for better alignment).
                    </p>
                  </div>
                </div>
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="group relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <MessageSquare className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-xs font-bold text-black">2</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Ask Anything</h3>
                    <p className="text-lg text-white/70 leading-relaxed">
                      Query in natural language: 'Explain Topic 3 from Chapter 5' or 'Generate notes for Unit 2'.
                    </p>
                  </div>
                </div>
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="group relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <motion.div
                      className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/15 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <FileCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-xs font-bold text-black">3</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Get Grounded Answers</h3>
                    <p className="text-lg text-white/70 leading-relaxed">
                      AI pulls exact text from your book, cites pages, and explains simply.
                    </p>
                  </div>
                </div>
                <motion.div
                  className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scaleY: 0 }}
                  whileHover={{ scaleY: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </div>

            {/* Right Side - Animated Workflow Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <AnimatedWorkflowMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-gradient-to-b from-black via-[#030303] to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl"
            animate={{
              scale: [1.4, 1, 1.4],
              x: [0, -100, 0],
              y: [0, 50, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold rounded-full mb-6"
            >
              FEATURES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight text-center"
            >
              <div className="block">Built for Students</div>
              <motion.span
                className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                and Teachers
              </motion.span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl text-white/70 max-w-2xl mx-auto"
            >
              Everything you need to learn faster and teach better.
            </motion.p>
          </motion.div>

          {/* Features Grid */}
          <FeaturesSectionWithHoverEffects />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs">
        <FAQ />
      </section>

      {/* Footer */}
      <HoverFooter />

      {/* Copyright at the very end */}
      <div className="bg-white py-3 px-4 sm:px-6 border-t border-gray-200">
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <p className="text-gray-600 whitespace-nowrap">
              &copy; {new Date().getFullYear()} ESo AI. All rights reserved.
            </p>
            <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
            <p className="text-gray-600 whitespace-nowrap">
              Made with ❤️ by Md Suhail
            </p>
          </div>
        </div>
        </div>
      </main>
  );
}
