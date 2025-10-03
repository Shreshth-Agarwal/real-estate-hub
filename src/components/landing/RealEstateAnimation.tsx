"use client";

import { motion } from "framer-motion";
import { Building2, Home, Warehouse, Store, Hammer, Wrench } from "lucide-react";

export default function RealEstateAnimation() {
  const buildings = [
    { Icon: Building2, delay: 0, x: -120, y: 60, scale: 1.2 },
    { Icon: Home, delay: 0.3, x: 140, y: 40, scale: 1 },
    { Icon: Warehouse, delay: 0.6, x: -100, y: -50, scale: 1.3 },
    { Icon: Store, delay: 0.9, x: 150, y: -30, scale: 0.9 },
    { Icon: Hammer, delay: 1.2, x: -60, y: 100, scale: 0.8 },
    { Icon: Wrench, delay: 1.5, x: 80, y: -80, scale: 0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated buildings */}
      {buildings.map(({ Icon, delay, x, y, scale }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [scale * 0.9, scale * 1.1, scale * 0.9],
            x: [0, x, 0],
            y: [0, y, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 12 + index * 2,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute"
          style={{
            left: `${15 + index * 15}%`,
            top: `${25 + index * 12}%`,
          }}
        >
          <Icon className="w-32 h-32 text-primary" />
        </motion.div>
      ))}
      
      {/* Animated connecting lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {[0, 1, 2, 3].map((i) => (
          <motion.line
            key={i}
            x1={`${15 + i * 15}%`}
            y1={`${25 + i * 12}%`}
            x2={`${30 + i * 15}%`}
            y2={`${37 + i * 12}%`}
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="10,5"
            className="text-primary"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0], 
              opacity: [0, 0.3, 0] 
            }}
            transition={{ 
              duration: 4, 
              delay: i * 0.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-primary rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [null, "-100%"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}