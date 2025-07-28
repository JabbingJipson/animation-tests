import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationItem from "./NavigationItem";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProject?: string;
  onProjectSelect: (projectId: string) => void;
}

const NavigationOverlay = ({ 
  isOpen, 
  onClose, 
  projects, 
  activeProject, 
  onProjectSelect 
}: NavigationOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-start pt-20 pl-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={overlayRef}
            className="p-6 min-w-[220px]"
            initial={{ 
              opacity: 0, 
              y: -40, 
              scale: 0.95 
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1 
            }}
            exit={{ 
              opacity: 0, 
              y: -40, 
              scale: 0.95 
            }}
            transition={{
              duration: 0.8,
              ease: [0, 0.8, 0, 1]
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Items */}
            <div className="space-y-2">
              {projects.map((project, index) => (
                <NavigationItem
                  key={project.id}
                  title={project.title}
                  isActive={activeProject === project.id}
                  onClick={() => {
                    onProjectSelect(project.id);
                    onClose();
                  }}
                />
              ))}
              
              {/* Create Account */}
              <NavigationItem
                title="Create Account"
                onClick={() => {
                  window.location.href = "/create-account";
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationOverlay; 