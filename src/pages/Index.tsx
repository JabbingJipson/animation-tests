import { useState } from "react";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationSidebar from "@/components/NavigationSidebar";
import RiveTester from "@/components/RiveTester";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

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
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{currentProject.title}</h2>
              <p className="text-muted-foreground">{currentProject.description}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <BackgroundVectors />
      
      <div className="relative z-10 flex">
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
    </div>
  );
};

export default Index;
