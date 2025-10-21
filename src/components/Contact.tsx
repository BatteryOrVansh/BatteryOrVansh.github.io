import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Mail, Linkedin, Github, Code2 } from "lucide-react";

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "officialvanshdixit@gmail.com",
      link: "mailto:officialvanshdixit@gmail.com",
      color: "text-primary"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "Connect with me",
      link: "https://www.linkedin.com/in/vanshdixit/",
      color: "text-secondary"
    },
    {
      icon: Github,
      title: "GitHub",
      value: "@BatteryOrVansh",
      link: "https://github.com/BatteryOrVansh",
      color: "text-primary"
    },
    {
      icon: Code2,
      title: "LeetCode",
      value: "Solve with me",
      link: "https://leetcode.com/u/vanshdixit/",
      color: "text-secondary"
    }
  ];

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-8"></div>
          
          <p className="text-center text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift group cursor-pointer"
                  onClick={() => window.open(method.link, '_blank')}
                >
                  <div className={`inline-flex p-4 rounded-xl bg-muted mb-4 ${method.color} group-hover:glow-red transition-all duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {method.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground">
                    {method.value}
                  </p>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready to start a project?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you have a question, want to start a project, or simply want to connect, 
              feel free to reach out to me through any of the channels above.
            </p>
            <Button 
              size="lg"
              className="gradient-red-yellow hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-red"
              onClick={() => window.open("mailto:officialvanshdixit@gmail.com", '_blank')}
            >
              Send me an email
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
