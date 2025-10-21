import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

const Projects = () => {
  const projects = [
    {
      title: "Glide UpSkill",
      event: "Vaultheist Hackathon, CGC University, Mohali",
      description: "A personalized, AI-driven career learning ecosystem that guides users through tailored roadmaps, verifies sincere project effort, immerses them in realistic job simulations, and leads toward credible certifications.",
      role: "Designed the Frontend and the control flow for better user experience, developed strategies to embed the product with unique features and scale it monetarily.",
      tags: ["AI/ML", "Frontend", "Product Strategy", "UX Design"],
      gradient: "from-primary/20 to-secondary/20"
    },
    {
      title: "Manobal",
      event: "Smart India Hackathon",
      description: "An institution-specific web platform providing students confidential mental health support.",
      role: "Complete research on GAD-7 parameters for mental health assessment implementation.",
      tags: ["Healthcare", "Web Development", "Research", "Mental Health"],
      gradient: "from-secondary/20 to-primary/20"
    },
    {
      title: "PRAMAAN",
      event: "TechKriti Hackathon, IIT Kanpur",
      description: "Professional Reports & Analysis on Money, Assets And Net-gains. LLM for Financial Statement Simplifier.",
      role: "Data Cleaning and Visualisation for financial analytics.",
      tags: ["FinTech", "Data Science", "LLM", "Visualization"],
      gradient: "from-primary/20 to-secondary/20"
    }
  ];

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-16"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index}
                className="p-8 bg-card/50 backdrop-blur-sm border-border hover-lift group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                      {project.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-secondary font-semibold mb-4">
                    {project.event}
                  </p>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">Role:</span> {project.role}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge 
                        key={tagIndex}
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
