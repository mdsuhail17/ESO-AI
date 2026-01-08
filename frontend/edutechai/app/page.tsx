'use client';

import { HeroGeometric } from './components/ui/shape-landing-hero';
import Link from 'next/link';
import { Upload, MessageSquare, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import HoverFooter from './components/ui/hover-footer';
import { FeaturesSectionWithHoverEffects } from './components/ui/feature-section-with-hover-effects';
import { AnimatedWorkflowMockup } from './components/ui/animated-workflow-mockup';
import { LogoScroll } from './components/ui/logo-scroll';
import { ProblemSection } from './components/ui/problem-section';
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
        badge="Your AI Study Partner"
        title1="Stop Wasting Hours"
        title2="Searching Textbooks"
        subtitle="Upload your textbook PDF and get instant answers, simplified explanations, and structured notes."
        onTryItClick={handleTryItClick}
        onWatchDemoClick={handleWatchDemoClick}
      />

      {/* Logo Scroll Section */}
      <LogoScroll />

      {/* Problem Section */}
      <ProblemSection />

      {/* Solution Section */}
      <section id="solution" className="py-24 md:py-32 px-6 md:px-8 bg-gradient-to-b from-black to-[#030303] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm text-white/60 mb-4">
              THE SOLUTION
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4">
              Your Personal Textbook{' '}
              <span className="text-[#3ca2fa]">AI</span>
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Simple, Accurate, Fast
            </p>
          </motion.div>

          {/* Steps with Animated Mockup */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Side - Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
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
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
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
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                <div className="flex gap-6 items-start">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <FileCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
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
              </motion.div>
            </div>

            {/* Right Side - Animated Workflow Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
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
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold rounded-full mb-6"
            >
              FEATURES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-center"
            >
              <div className="block">Built for Students</div>
              <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent block">
                and Teachers
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
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
              &copy; {new Date().getFullYear()} Eso AI. All rights reserved.
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
