interface ProjectViewerProps {
  projectId: string;
  title: string;
  description: string;
}

const ProjectViewer = ({ projectId, title, description }: ProjectViewerProps) => {
  return (
    <div className="flex-1 p-12">
      {/* Project header */}
      <div className="mb-8">
        <div className="text-sm font-mono text-muted-foreground mb-2 tracking-widest">
          PROJECT {projectId}
        </div>
        <h1 className="text-4xl font-light uppercase tracking-wider mb-4">
          {title}
        </h1>
        <p className="text-muted-foreground max-w-md leading-relaxed">
          {description}
        </p>
      </div>

      {/* Central canvas area */}
      <div className="relative">
        <div className="w-full max-w-2xl mx-auto aspect-square">
          {/* Canvas placeholder - this is where Rive animations would be embedded */}
          <div className="w-full h-full border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* Placeholder content */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border border-primary/30 mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-glow-secondary animate-glow-pulse" />
              </div>
              <div className="text-sm font-mono text-muted-foreground tracking-wider">
                RIVE CANVAS
              </div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                Interactive animation workspace
              </div>
            </div>

            {/* Geometric overlay */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" 
              viewBox="0 0 400 400"
            >
              <circle 
                cx="200" cy="200" r="150" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="1"
                className="animate-float-slow"
              />
              <circle 
                cx="200" cy="200" r="100" 
                fill="none" 
                stroke="hsl(var(--glow-secondary))" 
                strokeWidth="0.5"
                className="animate-drift"
              />
              <line 
                x1="50" y1="200" x2="350" y2="200" 
                stroke="hsl(var(--primary))" 
                strokeWidth="0.5"
                opacity="0.5"
              />
              <line 
                x1="200" y1="50" x2="200" y2="350" 
                stroke="hsl(var(--primary))" 
                strokeWidth="0.5"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Project controls */}
        <div className="absolute top-0 right-0">
          <div className="flex gap-2 text-xs font-mono">
            <button className="px-3 py-2 border border-border/50 rounded-md hover:border-primary/50 transition-colors">
              EDIT
            </button>
            <button className="px-3 py-2 border border-border/50 rounded-md hover:border-primary/50 transition-colors">
              PREVIEW
            </button>
            <button className="px-3 py-2 border border-border/50 rounded-md hover:border-primary/50 transition-colors">
              EXPORT
            </button>
          </div>
        </div>
      </div>

      {/* Project details */}
      <div className="mt-12 max-w-md">
        <h3 className="text-sm font-mono text-muted-foreground mb-4 tracking-widest">
          DESCRIPTION
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          To start your creation, begin by setting up the basic structure and interactions. 
          Each Rive animation should be self-contained and optimized for web integration.
        </p>
      </div>
    </div>
  );
};

export default ProjectViewer;