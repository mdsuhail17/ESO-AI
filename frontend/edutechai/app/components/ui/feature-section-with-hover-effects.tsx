"use client";

import { cn } from "@/lib/utils";
import {
  Search,
  Lightbulb,
  BookOpen,
  FileText,
  Clock,
  Share2,
  CheckCircle,
} from "lucide-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Instant Answers",
      description:
        "Find exact textbook content in seconds – no more manual searching.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Simple Explanations",
      description:
        "Don't understand? Ask 'Explain this simply' – grounded in your book.",
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      title: "Exam Prep Mode",
      description:
        "Align queries with syllabus for focused revision.",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Note Generation",
      description: "Create bullet-point notes, slides, or quizzes from textbook extracts.",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      title: "Time Saver",
      description: "Turn 2-hour prep into minutes.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Shareable Outputs",
      description:
        "Export as PDF/Markdown for students.",
      icon: <Share2 className="w-6 h-6" />,
    },
    {
      title: "Accurate & Faithful",
      description:
        "Always references your textbook – no hallucinations.",
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      title: "Always Available",
      description: "Access your textbooks and get answers anytime, anywhere.",
      icon: <BookOpen className="w-6 h-6" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-white/10",
        (index === 0 || index === 4) && "lg:border-l border-white/10",
        index < 4 && "lg:border-b border-white/10"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400 text-white/70">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-white/20 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10 text-white/70">
        {description}
      </p>
    </div>
  );
};

