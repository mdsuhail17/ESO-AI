"use client";

import { motion } from "framer-motion";
import { Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border border-white/[0.1]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.05)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroGeometric({
    badge = "Design Collective",
    title1 = "Elevate Your Digital Vision",
    title2 = "Crafting Exceptional Websites",
    subtitle = "Crafting exceptional digital experiences through innovative design and cutting-edge technology.",
    onTryItClick,
    onWatchDemoClick,
}: {
    badge?: string;
    title1?: string;
    title2?: string;
    subtitle?: string;
    onTryItClick?: () => void;
    onWatchDemoClick?: () => void;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.3 + i * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]" />

            {/* Decorative shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={500}
                    height={120}
                    rotate={12}
                    gradient="from-indigo-500/[0.08]"
                    className="left-[-8%] top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={400}
                    height={100}
                    rotate={-15}
                    gradient="from-rose-500/[0.08]"
                    className="right-[-3%] top-[70%]"
                />
                <ElegantShape
                    delay={0.4}
                    width={250}
                    height={70}
                    rotate={-8}
                    gradient="from-violet-500/[0.08]"
                    className="left-[8%] bottom-[12%]"
                />
                <ElegantShape
                    delay={0.6}
                    width={180}
                    height={50}
                    rotate={20}
                    gradient="from-amber-500/[0.08]"
                    className="right-[18%] top-[12%]"
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 container mx-auto px-6 md:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] mb-8"
                    >
                        <span className="flex items-center gap-1.5">
                            <Circle className="h-1.5 w-1.5 fill-indigo-400" />
                            <span className="text-xs font-semibold text-white/80 tracking-wide">
                                Eso AI
                            </span>
                        </span>
                        <span className="text-white/30">:</span>
                        <span className="text-xs font-medium text-white/50 tracking-wide">
                            {badge}
                        </span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
                    >
                        <span className="text-white block mb-1">
                            {title1}
                        </span>
                        <span className="bg-gradient-to-r from-indigo-300 via-white to-rose-300 bg-clip-text text-transparent block">
                            {title2}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-base sm:text-lg text-white/40 mb-10 leading-relaxed max-w-xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                    >
                        <Button
                            onClick={onTryItClick}
                            size="lg"
                            className="px-7 py-3 text-sm bg-white text-black hover:bg-white/90 rounded-full font-medium transition-all duration-300 hover:scale-105"
                        >
                            Try it for Free
                        </Button>
                        <Button
                            onClick={onWatchDemoClick}
                            variant="outline"
                            size="lg"
                            className="px-7 py-3 text-sm bg-transparent hover:bg-white/[0.05] border border-white/20 text-white/70 hover:text-white rounded-full font-medium transition-all duration-300 flex items-center gap-2"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Watch Demo
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030303] to-transparent pointer-events-none" />
        </div>
    );
}

export { HeroGeometric }
