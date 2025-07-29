import { useState } from "react";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationOverlay from "@/components/NavigationOverlay";
import RiveTester from "@/components/RiveTester";
import { Button } from "@/components/ui/button";
import AnimatedMenuButton from "@/components/AnimatedMenuButton";
import FontAndColorSamples from "./FontAndColorSamples";
import { motion } from "framer-motion";

const projects = [
  {
    id: "rive-tester",
    title: "Rive Asset Tester",
    description: "Test your Rive animations and state machine interactions with various triggers and controls."
  },
  {
    id: "font-color-samples",
    title: "Font & Color Samples",
    description: "View the style guide for typography and color usage."
  }
];

const Index = () => {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [overlayOpen, setOverlayOpen] = useState(false);
  
  const currentProject = projects.find(p => p.id === activeProject) || projects[0];

  const renderProjectContent = () => {
    switch (currentProject.id) {
      case "rive-tester":
        return <RiveTester />;
      case "font-color-samples":
        return (
          <FontAndColorSamples 
            showNavigation={false} 
            overlayOpen={overlayOpen}
            onOverlayToggle={() => setOverlayOpen((open) => !open)}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-display mb-2">{currentProject.title}</h2>
              <p className="text-caption">{currentProject.description}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <BackgroundVectors />
      
      {/* Fixed Navigation Button - Outside sliding container */}
      <AnimatedMenuButton
        isOpen={overlayOpen}
        onToggle={() => setOverlayOpen((open) => !open)}
        className="fixed top-4 left-4 z-50"
      />
      
      <motion.div 
        className="relative z-10 flex flex-1 overflow-auto"
        animate={{
          x: overlayOpen ? (window.innerWidth <= 768 ? 220 : 0) : 0
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
      >
        <div className="flex-1 p-6">
          {renderProjectContent()}
        </div>
      </motion.div>

      {/* Navigation Overlay */}
      <NavigationOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        projects={projects}
        activeProject={activeProject}
        onProjectSelect={setActiveProject}
      />

      {/* Footer with Return to Top */}
      <footer className="w-full py-6 flex justify-center items-center bg-card border-t border-border mt-auto">
        <Button
          onClick={() => {
            // Custom smooth scroll to top with 200ms duration
            const start = window.scrollY;
            const duration = 200;
            const startTime = performance.now();
            function easeInOut(t) {
              return t < 0.5
                ? 2 * t * t
                : -1 + (4 - 2 * t) * t;
            }
            function animateScroll(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeInOut(progress);
              window.scrollTo(0, start * (1 - eased));
              if (progress < 1) {
                requestAnimationFrame(animateScroll);
              }
            }
            requestAnimationFrame(animateScroll);
          }}
        >
          Return to Top
        </Button>
      </footer>
    </div>
  );
};

export default Index;
