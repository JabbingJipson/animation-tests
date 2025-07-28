import { Button } from "@/components/ui/button";
import NavigationItem from "./NavigationItem";

interface Project {
  id: string;
  title: string;
  description: string;
}

interface NavigationSidebarProps {
  projects: Project[];
  activeProject?: string;
  onProjectSelect: (projectId: string) => void;
}

const NavigationSidebar = ({ projects, activeProject, onProjectSelect }: NavigationSidebarProps) => {
  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-card/20 backdrop-blur-sm border-r border-border/30 p-8 pt-20">
      <div className="mb-12">
        <h1 className="text-sm font-mono text-muted-foreground mb-2 tracking-widest">
          RIVE STUDIO
        </h1>
        <h2 className="text-2xl font-light uppercase tracking-wider text-foreground">
          Projects
        </h2>
      </div>

      <div className="space-y-3">
        {projects.map((project, index) => (
          <NavigationItem
            key={project.id}
            title={project.title}
            isActive={activeProject === project.id}
            onClick={() => onProjectSelect(project.id)}
          />
        ))}
        
        {/* Create Account page link */}
        <NavigationItem
          title="Create Account"
          onClick={() => window.location.href = "/create-account"}
        />
        
        {/* Add new project button */}
        <NavigationItem
          title="New Project"
          onClick={() => {}}
        />
      </div>

      {/* Footer controls */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex gap-4 text-xs font-mono text-muted-foreground">
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <div className="w-4 h-4 rounded-sm border border-current flex items-center justify-center">
              A
            </div>
            SELECT
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <div className="w-4 h-4 rounded-sm border border-current flex items-center justify-center">
              B
            </div>
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;