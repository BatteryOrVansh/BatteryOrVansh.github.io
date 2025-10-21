import { Card } from "./ui/card";
import { Trophy, Calendar } from "lucide-react";

const Hackathons = () => {
  const hackathons = [
    {
      name: "Hack-A-Run",
      date: "November 2023",
      location: "BBD University, Lucknow",
      achievement: "🏆 1st Position",
      description: "Developed Student Session Website with a minimal Pomodoro studying technique integrated with live music, note-taking, Blackbox-AI and internet search, to-do list and focused sessions to enhance the learning experience of students."
    },
    {
      name: "Smart India Hackathon",
      date: "2024",
      location: "National Level",
      description: "Proposed a multilingual chatbot-based ticketing system for museums to automate bookings, payments, and visitor analytics."
    },
    {
      name: "TechKriti with NFRA",
      date: "March 2025",
      location: "IIT, Kanpur",
      description: "Created 'PRAMAAN,' an AI-driven platform for automated financial reporting and visualization. Integrated data preprocessing, anomaly detection, and Chart.js dashboards for real-time insights."
    },
    {
      name: "Bhartiya Antariksh Hackathon",
      date: "July 2025",
      location: "ISRO",
      description: "Developed 'Vaayu Darshak,' a hyperlocal air quality monitoring and forecasting app leveraging satellite and ground station data with advanced ML models. Achieved successful pilot deployment."
    },
    {
      name: "Smart India Hackathon",
      date: "2025",
      location: "National Level",
      description: "Developed 'MANOBAL,' a digital mental health and psychological support platform tailored for Indian college students. Collaborated in end-to-end solution design including AI-assisted screening, peer support, and admin dashboards."
    },
    {
      name: "Vaultheist ISTE Hackathon",
      date: "October 2025",
      location: "CGC University, Mohali",
      description: "Developed 'Glide UpSkill', an AI-powered personalized career learning platform featuring adaptive roadmaps, verified project submissions, and industry-level job simulations. Led product strategy and designed the user experience."
    }
  ];

  return (
    <section id="hackathons" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Hackathons & <span className="text-gradient">Competitions</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-16"></div>

          <div className="space-y-6">
            {hackathons.map((hackathon, index) => (
              <Card 
                key={index}
                className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-border hover-lift group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-red-yellow">
                      <Trophy className="w-8 h-8 text-background" />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-gradient transition-all duration-300">
                          {hackathon.name}
                        </h3>
                        {hackathon.achievement && (
                          <p className="text-lg text-secondary font-semibold mt-1">
                            {hackathon.achievement}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{hackathon.date}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-primary font-medium mb-3">
                      {hackathon.location}
                    </p>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {hackathon.description}
                    </p>
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

export default Hackathons;
