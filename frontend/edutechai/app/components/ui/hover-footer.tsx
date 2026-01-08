"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  ExternalLink,
} from "lucide-react";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(false);
          setTimeout(() => setIsInView(true), 50);
        }
      },
      { threshold: 0.3 }
    );
    if (svgRef.current) {
      observer.observe(svgRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#80eeb4" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-neutral-200 font-[helvetica] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#3ca2fa] font-[helvetica] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold
        dark:stroke-[#3ca2fa99]"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={isInView ? {
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        } : { strokeDashoffset: 1000, strokeDasharray: 1000 }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #0F0F1166 50%, #3ca2fa33 100%)",
      }}
    />
  );
};

function HoverFooter() {
  // Footer link data
  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Get Started", href: "/dashboard" },
        { label: "FAQ", href: "#faqs" },
      ],
    },
  ];

  // Contact info data
  const contactInfo = [
    {
      icon: <Phone size={18} className="text-[#3ca2fa]" />,
      text: "+91 9353649419",
      href: "tel:+919353649419",
    },
    {
      icon: <MapPin size={18} className="text-[#3ca2fa]" />,
      text: "Bangalore Karnataka",
    },
    {
      icon: <Mail size={18} className="text-[#3ca2fa]" />,
      text: "mdsuhail.code@gmail.com",
      href: "mailto:mdsuhail.code@gmail.com",
    },
  ];

  // Social media icons
  const socialLinks = [
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "https://www.linkedin.com/in/md-suhail-8632ab317" },
    { icon: <ExternalLink size={20} />, label: "Portfolio", href: "https://mdsuhail.vercel.app/" },
    { icon: <Github size={20} />, label: "GitHub", href: "https://github.com/mdsuhail17" },
  ];

  return (
    <footer id="contact" className="bg-[#0F0F11]/10 relative h-fit rounded-2xl overflow-hidden mx-4 sm:mx-6 my-6">
      <motion.div
        className="w-full mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-12 z-50 relative pointer-events-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10">
          {/* Brand section */}
          <motion.div
            className="flex flex-col space-y-4 sm:col-span-2 lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-2">
              <span className="text-[#3ca2fa] text-2xl md:text-3xl font-extrabold">
                &hearts;
              </span>
              <span className="text-white text-2xl md:text-3xl font-bold">Eso AI</span>
            </div>
            <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-xs">
              Your intelligent study companion. Transform learning with AI-powered textbook assistance.
            </p>
          </motion.div>

          {/* Product links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks[0].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-[#3ca2fa] transition-colors text-sm md:text-base"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-[#3ca2fa]">{item.icon}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/60 hover:text-[#3ca2fa] transition-colors text-sm md:text-base"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/60 text-sm md:text-base">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Linkedin size={16} className="text-[#3ca2fa]" />
                <a
                  href="https://www.linkedin.com/in/md-suhail-8632ab317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#3ca2fa] transition-colors text-sm md:text-base"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <ExternalLink size={16} className="text-[#3ca2fa]" />
                <a
                  href="https://mdsuhail.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#3ca2fa] transition-colors text-sm md:text-base"
                >
                  Portfolio
                </a>
              </li>
              <li className="flex items-center space-x-2 relative z-50">
                <Github size={16} className="text-[#3ca2fa]" />
                <a
                  href="https://github.com/mdsuhail17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#3ca2fa] transition-colors text-sm md:text-base"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Text hover effect */}
      <div className="flex h-[20rem] sm:h-[22rem] md:h-[24rem] lg:h-[28rem] -mt-8 md:-mt-12 lg:-mt-16 pointer-events-none w-full">
        <TextHoverEffect text="Eso AI" className="z-0 pointer-events-none w-full opacity-60" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
