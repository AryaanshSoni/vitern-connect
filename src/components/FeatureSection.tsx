import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, FileText, Trophy, Target, MessageCircle } from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: Briefcase,
      title: "Internship Finder",
      description: "Browse and apply to internships filtered by your skills, CGPA, and preferences. Connect directly with recruiters.",
      items: ["Skill-based matching", "CGPA filtering", "Company profiles", "Direct applications"]
    },
    {
      icon: Users,
      title: "Mentorship Network",
      description: "Connect with seniors and industry experts in topic-based chat rooms for guidance and career advice.",
      items: ["Senior mentors", "Topic-based rooms", "DSA prep guidance", "Career counseling"]
    },
    {
      icon: FileText,
      title: "AI Resume Generator",
      description: "Create professional resumes with our AI-powered tool. Multiple templates and instant PDF generation.",
      items: ["Multiple templates", "AI-powered content", "Instant PDF export", "Professional formatting"]
    },
    {
      icon: Trophy,
      title: "Student Leaderboard",
      description: "Showcase your achievements and get recognized. Top performers get visibility to recruiters.",
      items: ["CGPA rankings", "Skill highlights", "Achievement badges", "Recruiter visibility"]
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need to Launch Your Career
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From finding the perfect internship to building professional connections, 
            VITERN provides all the tools VIT students need to succeed.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="card-feature group">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">{feature.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-lg text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Future Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-elevated">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">AI Career Guidance</h4>
              <p className="text-muted-foreground">Personalized skill roadmaps and career path recommendations</p>
            </div>
            <div className="card-elevated">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Skill Gap Analysis</h4>
              <p className="text-muted-foreground">Identify and bridge gaps in your skillset for dream roles</p>
            </div>
            <div className="card-elevated">
              <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Smart Recommendations</h4>
              <p className="text-muted-foreground">AI-powered internship matching based on your profile</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;