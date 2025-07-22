import { useState } from "react";
import BackgroundVectors from "@/components/BackgroundVectors";
import NavigationSidebar from "@/components/NavigationSidebar";
import RiveTester from "@/components/RiveTester";

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
        <NavigationSidebar 
          projects={projects}
          activeProject={activeProject}
          onProjectSelect={setActiveProject}
        />
        
        <div className="ml-80 flex-1 p-6">
          {renderProjectContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
