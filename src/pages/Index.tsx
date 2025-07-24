import { useState } from "react";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationSidebar from "@/components/NavigationSidebar";
import RiveTester from "@/components/RiveTester";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import FontAndColorSamples from "./FontAndColorSamples";

const projects = [
  {
    id: "rive-tester",
    title: "Rive Asset Tester",
    description: "Test your Rive animations and state machine interactions with various triggers and controls."
  },
  {
    id: "02", 
    title: "Morphing Shapes",
    description: "Geometric transformation animation featuring smooth morphing between different polygon shapes."
  },
  {
    id: "03",
    title: "Character Walk",
    description: "Skeletal animation system for character movement with procedural walk cycle generation."
  },
  {
    id: "04",
    title: "UI Transitions",
    description: "Micro-interactions and state transitions for modern user interface components."
  },
  {
    id: "font-color-samples",
    title: "Font & Color Samples",
    description: "View the style guide for typography and color usage."
  }
];

const Index = () => {
  const [activeProject, setActiveProject] = useState(projects[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar hidden
  
  const currentProject = projects.find(p => p.id === activeProject) || projects[0];

  const renderProjectContent = () => {
    switch (currentProject.id) {
      case "rive-tester":
        return <RiveTester />;
      case "font-color-samples":
        return <FontAndColorSamples />;
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
      
      <div className="relative z-10 flex flex-1 overflow-auto">
        {sidebarOpen && (
          <NavigationSidebar 
            projects={projects}
            activeProject={activeProject}
            onProjectSelect={setActiveProject}
          />
        )}
        
        <div className={sidebarOpen ? "ml-80 flex-1 p-6" : "flex-1 p-6"}>
          {/* Toggle Sidebar Button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-4 left-4 z-20"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu className="w-5 h-5" />
          </Button>
          {renderProjectContent()}
        </div>
      </div>
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
