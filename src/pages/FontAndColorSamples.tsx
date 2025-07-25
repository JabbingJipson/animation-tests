import React, { useState } from "react";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationSidebar from "@/components/NavigationSidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function FontAndColorSamples() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const activeProject = React.useMemo(() => {
    if (location.pathname === "/font-color-samples") return "font-color-samples";
    if (location.pathname === "/") return projects[0].id;
    return null;
  }, [location.pathname]);

  const handleProjectSelect = (projectId: string) => {
    if (projectId === "rive-tester") navigate("/");
    else if (projectId === "create-account") navigate("/create-account");
    else if (projectId === "font-color-samples") navigate("/font-color-samples");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <BackgroundVectors />
      <div className="relative z-10 flex flex-1 overflow-auto">
        {sidebarOpen && (
          <NavigationSidebar 
            projects={projects}
            activeProject={activeProject}
            onProjectSelect={handleProjectSelect}
          />
        )}
        <div className={sidebarOpen ? "ml-80 flex-1 flex items-center justify-center" : "flex-1 flex items-center justify-center"}>
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
          <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6 space-y-6">
            {/* Color Palette Demo */}
            <div className="mb-8">
              <h2 className="text-title mb-2">Color Palette Demo</h2>
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-12 rounded bg-brand-50 border flex items-center justify-center text-xs text-brand-300">brand-50</div>
                <div className="w-24 h-12 rounded bg-brand-300 border flex items-center justify-center text-xs text-brand-50">brand-300</div>
              </div>
              <div className="flex gap-4">
                <div className="w-32 h-12 rounded bg-background border flex items-center justify-center text-xs text-foreground">background</div>
                <div className="w-32 h-12 rounded bg-primary border flex items-center justify-center text-xs text-primary-foreground">primary</div>
                <div className="w-32 h-12 rounded bg-secondary border flex items-center justify-center text-xs text-secondary-foreground">secondary</div>
                <div className="w-32 h-12 rounded bg-accent border flex items-center justify-center text-xs text-accent-foreground">accent</div>
                <div className="w-32 h-12 rounded bg-card border flex items-center justify-center text-xs text-card-foreground">card</div>
              </div>
            </div>
            {/* Font Style Demo */}
            <div className="mb-8">
              <h2 className="text-title mb-2">Font Style Demo</h2>
              <div className="space-y-2">
                <div>
                  <span className="block text-display">Header 1 / Display (text-display)</span>
                </div>
                <div>
                  <span className="block text-title">Header 2 / Title (text-title)</span>
                </div>
                <div>
                  <span className="block text-subtitle">Subtitle (text-subtitle)</span>
                </div>
                <div>
                  <span className="block text-body">Body (text-body)</span>
                </div>
                <div>
                  <span className="block text-caption">Caption / Secondary (text-caption)</span>
                </div>
                <div>
                  <span className="block text-code">Code / Mono (text-code)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 