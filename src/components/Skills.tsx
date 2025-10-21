import { Card } from "./ui/card";
import { Code2, Layers, Sparkles } from "lucide-react";

const Skills = () => {
  const skillCategories = [
    {
      icon: Code2,
      title: "Programming Languages",
      skills: ["Java", "Python", "C", "JavaScript", "HTML", "CSS"],
      color: "text-primary"
    },
    {
      icon: Layers,
      title: "Frameworks & Technologies",
      skills: ["React", "Node.js", "Matplotlib", "Seaborn", "Pandas", "Numpy", "Linux CLI"],
      color: "text-secondary"
    },
    {
      icon: Sparkles,
      title: "Areas of Interest",
      skills: ["Web Development", "AI/ML Integration", "Real-Time Systems", "Responsive UI/UX"],
      color: "text-primary"
    }
  ];

  return (
    <section id="skills" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={index}
                  className="p-8 bg-card/50 backdrop-blur-sm border-border hover-lift group"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-muted mb-6 ${category.color} group-hover:glow-red transition-all duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-6 text-foreground">
                    {category.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-muted border border-border rounded-full text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
