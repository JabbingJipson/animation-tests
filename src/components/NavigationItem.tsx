import React from "react";
import { motion } from "framer-motion";

interface NavigationItemProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavigationItem = ({ title, isActive = false, onClick, className = "" }: NavigationItemProps) => {
  return (
    <motion.div
      onClick={onClick}
      className={`relative w-full h-8 rounded-lg cursor-pointer overflow-hidden ${className}`}
      whileHover={{
        "--mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 47%, rgba(0,0,0,0) 81%)",
        "--webkit-mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 47%, rgba(0,0,0,0) 81%)",
      } as any}
      whileTap={{
        "--mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 47%, rgba(0,0,0,0) 81%)",
        "--webkit-mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 47%, rgba(0,0,0,0) 81%)",
      } as any}
      initial={{
        "--mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 70%)",
        "--webkit-mask-gradient": "radial-gradient(57% 100% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 70%)",
      } as any}
      transition={{
        duration: 0.4,
        ease: [0, 0.62, 0.37, 0.99],
        type: "tween"
      }}
      style={{
        borderBottom: "1px solid rgba(255, 255, 255, 0.89)",
        borderRadius: "8px",
        mask: "var(--mask-gradient)",
        WebkitMask: "var(--webkit-mask-gradient)",
        width: window.innerWidth > 768 ? "280px" : "100%", // Fixed width on desktop, flexible on mobile
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div className={`text-body text-center ${isActive ? 'text-body' : ''}`}>
          {title}
        </div>
      </div>
      
      {/* Selection indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
      )}
    </motion.div>
  );
};

export default NavigationItem; 