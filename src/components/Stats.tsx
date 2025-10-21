import { Card } from "./ui/card";
import { Github, Code2, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

const Stats = () => {
  const githubUsername = "BatteryOrVansh";
  const leetcodeUsername = "vanshdixit";

  return (
    <section id="stats" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="text-gradient">Activity</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-red-yellow mx-auto mb-16"></div>

          {/* GitHub Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-red-yellow">
                  <Github className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  GitHub Activity
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10"
                onClick={() => window.open(`https://github.com/${githubUsername}`, '_blank')}
              >
                View Profile
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* GitHub Stats Card */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift">
                <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                  Overall Statistics
                </h4>
                <div className="flex justify-center">
                  <img 
                    src={`https://github-readme-stats.vercel.app/api?username=${githubUsername}&show_icons=true&theme=radical&hide_border=true&bg_color=0D1117&title_color=FF0000&icon_color=FFD700&text_color=FFFFFF&count_private=true&include_all_commits=true`}
                    alt="GitHub Stats"
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
                </div>
              </Card>

              {/* GitHub Top Languages */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift">
                <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                  Top Languages
                </h4>
                <div className="flex justify-center">
                  <img 
                    src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUsername}&layout=compact&theme=radical&hide_border=true&bg_color=0D1117&title_color=FF0000&text_color=FFFFFF&langs_count=8`}
                    alt="Top Languages"
                    className="w-full rounded-lg"
                    loading="lazy"
                  />
                </div>
              </Card>
            </div>

            {/* GitHub Streak Chart - Full Width */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift">
              <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                Contribution Streak
              </h4>
              <div className="flex justify-center">
                <img 
                  src={`https://github-readme-streak-stats.herokuapp.com/?user=${githubUsername}&theme=radical&hide_border=true&background=0D1117&ring=FF0000&fire=FFD700&currStreakLabel=FF0000&sideLabels=FFFFFF&dates=FFFFFF`}
                  alt="GitHub Streak Stats"
                  className="w-full max-w-3xl rounded-lg"
                  loading="lazy"
                />
              </div>
            </Card>

            {/* GitHub Contribution Calendar - Full Width */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift mt-6">
              <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                Contribution Calendar
              </h4>
              <div className="flex justify-center overflow-x-auto">
                <img 
                  src={`https://ghchart.rshah.org/ff0000/${githubUsername}`}
                  alt="GitHub Contribution Calendar"
                  className="w-full rounded-lg"
                  loading="lazy"
                  style={{ minWidth: '800px' }}
                />
              </div>
            </Card>
          </div>

          {/* LeetCode Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-red-yellow">
                  <Code2 className="w-6 h-6 text-background" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  LeetCode Progress
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:bg-primary/10"
                onClick={() => window.open(`https://leetcode.com/u/${leetcodeUsername}/`, '_blank')}
              >
                View Profile
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* LeetCode Stats Card - Full Width */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift">
                <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                  Problem Solving Stats
                </h4>
                <div className="flex justify-center">
                  <img 
                    src={`https://leetcard.jacoblin.cool/${leetcodeUsername}?theme=dark&font=Ubuntu&ext=contest`}
                    alt="LeetCode Stats"
                    className="w-full max-w-2xl rounded-lg"
                    loading="lazy"
                  />
                </div>
              </Card>

              {/* LeetCode Submission Calendar Fallback */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover-lift">
                <h4 className="text-lg font-semibold mb-4 text-center text-foreground">
                  Submission Calendar
                </h4>
                <div className="flex flex-col items-center gap-4 p-8 bg-muted/30 rounded-lg border border-border">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-muted-foreground text-center">
                    View detailed submission calendar on{" "}
                    <a 
                      href={`https://leetcode.com/u/${leetcodeUsername}/`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:text-secondary underline font-medium"
                    >
                      LeetCode Profile →
                    </a>
                  </p>
                  <p className="text-muted-foreground/70 text-sm text-center">
                    The submission calendar heatmap is best viewed directly on LeetCode
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Real-time Update Notice */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-sm">
              📊 All statistics are automatically fetched and updated in real-time from GitHub and LeetCode
            </p>
            <p className="text-muted-foreground/70 text-xs mt-2">
              Data refreshes every 15-30 minutes via external APIs
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
