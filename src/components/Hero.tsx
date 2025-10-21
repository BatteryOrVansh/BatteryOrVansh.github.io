import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted opacity-50"></div>
      
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-muted border border-primary/20 rounded-full text-sm font-medium text-muted-foreground mb-8">
              Available for opportunities
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block">Vansh Dixit</span>
            <span className="block text-gradient animate-glow-pulse">Developer & Designer</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Full Stack Developer, Software Engineer, and Graphic Designer
          </p>
          
          <p className="text-base md:text-lg text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Building scalable solutions with modern technologies. Passionate about creating 
            impactful applications that solve real-world problems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gradient-red-yellow hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-red"
              onClick={() => scrollToSection("projects")}
            >
              View My Work
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary/50 hover:bg-primary/10 text-lg px-8 py-6"
              onClick={() => scrollToSection("contact")}
            >
              Get In Touch
            </Button>
          </div>

          <div className="mt-20 animate-bounce">
            <button
              onClick={() => scrollToSection("about")}
              className="inline-flex items-center justify-center p-3 rounded-full border border-primary/30 hover:bg-primary/10 transition-colors"
              aria-label="Scroll to about section"
            >
              <ArrowDown className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
