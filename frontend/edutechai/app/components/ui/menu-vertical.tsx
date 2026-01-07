"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

interface MenuVerticalProps {
  menuItems: MenuItem[];
  color?: string;
  skew?: number;
  onLinkClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export const MenuVertical = ({
  menuItems = [],
  color = "#ff6900",
  skew = 0,
  onLinkClick,
}: MenuVerticalProps) => {
  return (
    <div className="flex w-fit flex-col gap-3 px-2 whitespace-nowrap">
      {menuItems.map((item, index) => (
        <motion.div
          key={`${item.href}-${index}`}
          className="group/nav flex items-center gap-2 cursor-pointer text-white"
          initial="initial"
          whileHover="hover"
        >
          <motion.div
            variants={{
              initial: { x: "-100%", color: "inherit", opacity: 0 },
              hover: { x: 0, color, opacity: 1 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="z-0"
          >
            <ArrowRight strokeWidth={2.5} className="size-6" />
          </motion.div>

          <Link 
            href={item.href} 
            className="no-underline"
            onClick={(e) => onLinkClick?.(e, item.href)}
          >
            <motion.div
              variants={{
                initial: { x: -40, color: "inherit" },
                hover: { x: 0, color, skewX: skew },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="font-semibold text-xl text-white whitespace-nowrap"
            >
              {item.label}
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

