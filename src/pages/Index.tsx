import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certifications from "@/components/Certifications";
import Hackathons from "@/components/Hackathons";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter']">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Hackathons />
        <Stats />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
