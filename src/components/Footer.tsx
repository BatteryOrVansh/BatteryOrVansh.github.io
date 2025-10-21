import { Github, Linkedin, Mail, Code2 } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/BatteryOrVansh", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/vanshdixit/", label: "LinkedIn" },
    { icon: Code2, href: "https://leetcode.com/u/vanshdixit/", label: "LeetCode" },
    { icon: Mail, href: "mailto:officialvanshdixit@gmail.com", label: "Email" }
  ];

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Logo */}
          <div className="text-2xl font-black">
            <span className="text-gradient">Vansh Dixit</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-full bg-muted hover:bg-primary/10 border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© {currentYear} Vansh Dixit. All rights reserved.</p>
            <p className="mt-2">Built with React, TypeScript, and Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
