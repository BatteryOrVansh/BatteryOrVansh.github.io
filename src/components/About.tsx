import { Card } from "./ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-12"></div>

          <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-border hover-lift">
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              <p>
                I am a fast and avid learner who is liked by his teammates. Coming from a defence 
                background, discipline is deep rooted in my work ethics. I am passionate about 
                developing solutions that cater to the real world problems with quick and innovative ideas.
              </p>
              
              <p>
                At 16, I co-founded <span className="text-primary font-semibold">Juvenile Foundation</span>, 
                where I gained skills such as Leadership, Graphic Design, SEO, project management and 
                understanding the formal industrial work culture.
              </p>
              
              <p>
                What I find unique about me is that I understand where to apply emotional intelligence 
                and where to be practical. Learning from mistakes rather than regretting or frustrating 
                about it also makes me calm and reliable to work with.
              </p>

              <div className="pt-6 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-4">Current Status</h3>
                <p>
                  I am a <span className="text-primary font-semibold">B.Tech undergraduate at BBD University</span>, 
                  working towards gaining skills like Full-Stack, AI, ML, Data Structures and System Design.
                </p>
                <p className="mt-4">
                  Currently, I am incorporating my skills in my startup <span className="text-secondary font-semibold">WaterPlane</span>, 
                  which I co-founded where my team and I offer Digital Solutions to clients.
                </p>
                <p className="mt-4">
                  My goal is to learn as much as I can by participating in Hackathons, collaborative 
                  projects and developing real-world applications that impact people at scale.
                </p>
              </div>

              <div className="pt-6 flex items-center justify-center gap-2 text-muted-foreground/60">
                <span className="text-2xl">📍</span>
                <span>Lucknow, Uttar Pradesh</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
