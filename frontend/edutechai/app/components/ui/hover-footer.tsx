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
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
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
    <footer id="contact" className="bg-[#0F0F11]/10 relative h-fit rounded-3xl overflow-hidden m-8">
      <div className="w-full mx-auto p-14 z-50 relative pointer-events-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-8 md:gap-12 lg:gap-16 pb-12 justify-items-start">
          {/* Left spacing */}
          <div className="hidden lg:block"></div>
          {/* Brand section */}
          <div className="flex flex-col space-y-4 text-left">
            <div className="flex items-center justify-start space-x-2">
              <span className="text-[#3ca2fa] text-3xl md:text-4xl lg:text-5xl font-extrabold">
                &hearts;
              </span>
              <span className="text-white text-3xl md:text-4xl lg:text-5xl font-bold">ESo AI</span>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-white/70 leading-relaxed">
              Your intelligent study companion. Transform learning with AI-powered textbook assistance.
            </p>
          </div>

          {/* Spacing between Brand and Product */}
          <div className="hidden lg:block"></div>

          {/* Footer link sections */}
          {footerLinks.map((section, index) => (
            <div key={section.title} className="text-left">
              <h4 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#3ca2fa] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Spacing between Product and Contact Us */}
          <div className="hidden lg:block"></div>

          {/* Contact section */}
          <div className="text-left">
            <h4 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center justify-start space-x-3">
                  {item.icon}
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Spacing between Contact Us and Connect */}
          <div className="hidden lg:block"></div>

          {/* Connect section */}
          <div className="text-left">
            <h4 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-6">
              Connect
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center justify-start space-x-3">
                <Linkedin size={18} className="text-[#3ca2fa]" />
                <a
                  href="https://www.linkedin.com/in/md-suhail-8632ab317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center justify-start space-x-3">
                <ExternalLink size={18} className="text-[#3ca2fa]" />
                <a
                  href="https://mdsuhail.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg"
                >
                  Portfolio
                </a>
              </li>
              <li className="flex items-center justify-start space-x-3 relative z-50">
                <Github size={18} className="text-[#3ca2fa]" />
                <a
                  href="https://github.com/mdsuhail17"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#3ca2fa] transition-colors text-sm md:text-base lg:text-lg cursor-pointer relative z-50"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Right spacing */}
          <div className="hidden lg:block"></div>
        </div>

        <hr className="border-t border-white/10 my-8" />
      </div>

      {/* Text hover effect */}
      <div className="flex h-[20rem] md:h-[25rem] lg:h-[30rem] -mt-32 md:-mt-40 lg:-mt-52 -mb-20 md:-mb-28 lg:-mb-36 pointer-events-none w-full">
        <TextHoverEffect text="ESo AI" className="z-10 pointer-events-none w-full" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default HoverFooter;
