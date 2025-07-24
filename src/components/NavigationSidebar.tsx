import { Button } from "@/components/ui/button";

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
    <div className="fixed left-0 top-0 h-full w-80 bg-card/20 backdrop-blur-sm border-r border-border/30 p-8">
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
          <button
            key={project.id}
            onClick={() => onProjectSelect(project.id)}
            className={`
              w-full text-left group relative overflow-hidden rounded-lg
              transition-all duration-300 hover:bg-primary/10
              ${activeProject === project.id ? 'bg-primary/20' : ''}
            `}
          >
            <div className="p-4 flex items-center gap-4">
              <div className={`
                text-caption font-mono w-8 text-center
                ${activeProject === project.id ? 'text-title' : ''}
              `}>
                {index + 1}.
              </div>
              <div className="flex-1">
                <div className={`
                  text-title
                  ${activeProject === project.id ? 'text-title' : ''}
                `}>
                  {project.title}
                </div>
              </div>
            </div>
            
            {/* Selection indicator */}
            {activeProject === project.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary" />
            )}
          </button>
        ))}
        
        {/* Create Account page link */}
        <a
          href="/create-account"
          className="block w-full text-left group relative overflow-hidden rounded-lg transition-all duration-300 hover:bg-primary/10 mt-6"
        >
          <div className="p-4 flex items-center gap-4">
            <div className="text-caption font-mono w-8 text-center">*</div>
            <div className="flex-1">
              <div className="text-title">Create Account</div>
            </div>
          </div>
        </a>

        {/* Add new project button */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-primary mt-8"
        >
          <div className="text-caption font-mono w-8 text-center">+</div>
          <div className="text-caption">New Project</div>
        </Button>
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