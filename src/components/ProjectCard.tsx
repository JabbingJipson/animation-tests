import { Card } from "@/components/ui/card";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ProjectCard = ({ id, title, description, isActive = false, onClick }: ProjectCardProps) => {
  return (
    <Card 
      className={`
        relative overflow-hidden cursor-pointer border border-border/50 
        hover:border-primary/30 transition-all duration-500 group
        ${isActive ? 'border-primary bg-primary/5' : 'bg-card/30 backdrop-blur-sm'}
      `}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className={`
            w-8 h-8 rounded-sm flex items-center justify-center text-sm font-mono
            ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {id}
          </div>
          <h3 className="font-medium text-lg uppercase tracking-wider">
            {title}
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        
        {/* Subtle glow effect on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-primary/10 to-glow-secondary/10 
          opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${isActive ? 'opacity-20' : ''}
        `} />
      </div>
    </Card>
  );
};

export default ProjectCard;