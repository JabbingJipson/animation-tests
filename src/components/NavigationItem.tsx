import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface NavigationItemProps {
  title: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavigationItem = ({ title, isActive = false, onClick, className = "" }: NavigationItemProps) => {
  // More reliable mobile detection with state
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Adjust mask values for mobile - wider in y direction
  const maskWidth = isMobile ? "70%" : "57%";
  const maskHeight = isMobile ? "140%" : "100%";
  const maskCenterX = isMobile ? "50%" : "50%";
  const maskCenterY = isMobile ? "50%" : "50%";
  const maskFadeStart = isMobile ? "55%" : "47%";
  const maskFadeEnd = isMobile ? "85%" : "81%";
  const initialFadeStart = isMobile ? "45%" : "35%";
  const initialFadeEnd = isMobile ? "75%" : "70%";

  return (
    <motion.div
      onClick={onClick}
      className={`relative w-full h-8 rounded-lg cursor-pointer overflow-hidden ${className}`}
      whileHover={{
        "--mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${maskFadeStart}, rgba(0,0,0,0) ${maskFadeEnd})`,
        "--webkit-mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${maskFadeStart}, rgba(0,0,0,0) ${maskFadeEnd})`,
      } as any}
      whileTap={{
        "--mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${maskFadeStart}, rgba(0,0,0,0) ${maskFadeEnd})`,
        "--webkit-mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${maskFadeStart}, rgba(0,0,0,0) ${maskFadeEnd})`,
      } as any}
      initial={{
        "--mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${initialFadeStart}, rgba(0,0,0,0) ${initialFadeEnd})`,
        "--webkit-mask-gradient": `radial-gradient(${maskWidth} ${maskHeight} at ${maskCenterX} ${maskCenterY}, rgba(0,0,0,1) ${initialFadeStart}, rgba(0,0,0,0) ${initialFadeEnd})`,
      } as any}
      transition={{
        duration: 0.4,
        ease: [0, 0.62, 0.37, 0.99],
        type: "tween"
      }}
      style={{
        borderRadius: "8px",
        width: isMobile ? "100%" : "280px", // Fixed width on desktop, flexible on mobile
        userSelect: "none", // Prevent text selection
        WebkitUserSelect: "none", // For Safari
        MozUserSelect: "none", // For Firefox
        msUserSelect: "none", // For IE/Edge
      }}
    >
      {/* Text content - no mask, fully opaque */}
      <div className="absolute inset-0 flex items-center justify-center px-3 z-10">
        <div className={`text-body text-center ${isActive ? 'text-body' : ''}`}>
          {title}
        </div>
      </div>
      
      {/* Bottom border with mask effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          borderBottom: `1px solid ${isActive ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.89)"}`,
          mask: "var(--mask-gradient)",
          WebkitMask: "var(--webkit-mask-gradient)",
        }}
      />
      
      {/* Selection indicator - removed */}
    </motion.div>
  );
};

export default NavigationItem; 