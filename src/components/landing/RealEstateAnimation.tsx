"use client";

import { motion } from "framer-motion";
import { Building2, Home, Warehouse, Store } from "lucide-react";

export default function RealEstateAnimation() {
  const buildings = [
    { Icon: Building2, delay: 0, x: -100, y: 50 },
    { Icon: Home, delay: 0.2, x: 100, y: 30 },
    { Icon: Warehouse, delay: 0.4, x: -80, y: -40 },
    { Icon: Store, delay: 0.6, x: 120, y: -20 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {buildings.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
            x: [0, x, 0],
            y: [0, y, 0],
          }}
          transition={{
            duration: 8,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{
            left: `${20 + index * 20}%`,
            top: `${30 + index * 15}%`,
          }}
        >
          <Icon className="w-24 h-24 text-primary" />
        </motion.div>
      ))}
      
      {/* Animated lines connecting buildings */}
      <svg className="absolute inset-0 w-full h-full">
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1={`${20 + i * 20}%`}
            y1={`${30 + i * 15}%`}
            x2={`${40 + i * 20}%`}
            y2={`${45 + i * 15}%`}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5,5"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
}