import { Card } from "./ui/card";
import { ExternalLink, Award } from "lucide-react";
import { Button } from "./ui/button";

const Certifications = () => {
  const certifications = [
    {
      title: "IBM Cognitive Class Certification",
      issuer: "Cognitive Class",
      url: "https://courses.cognitiveclass.ai/certificates/692b1b38c3b6429a96dc56732d63efa2"
    },
    {
      title: "IBM Cognitive Class Certification",
      issuer: "Cognitive Class",
      url: "https://courses.cognitiveclass.ai/certificates/1187f382c39e4504a806395a0cda5f57"
    },
    {
      title: "Microsoft Learn Certification",
      issuer: "Microsoft",
      url: "https://learn.microsoft.com/api/achievements/share/en-us/VanshDixit-1823/NVWSDY2F?sharingId=EAB4B09E069AC788"
    }
  ];

  return (
    <section id="certifications" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gradient">Certifications</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <Card 
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift group"
              >
                <div className="flex flex-col h-full">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-red-yellow mb-4 self-start">
                    <Award className="w-6 h-6 text-background" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2 flex-grow">
                    {cert.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {cert.issuer}
                  </p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-primary/30 hover:bg-primary/10 group-hover:border-primary transition-all"
                    onClick={() => window.open(cert.url, '_blank')}
                  >
                    View Certificate
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
