import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, FileText } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-hero text-white py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Students collaborating on career development" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float-up">
            Your Career Starts{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Here
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-float-up" style={{ animationDelay: "0.2s" }}>
            Connect with internships, find mentors, and build your professional profile
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-float-up" style={{ animationDelay: "0.4s" }}>
            <Link to="/student/register">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-hero">
                Sign Up as Student
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/recruiter/register">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-xl font-semibold text-lg">
                Sign Up as Recruiter
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-float-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Internships</h3>
              <p className="text-blue-100">Discover opportunities that match your skills and interests</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Mentors</h3>
              <p className="text-blue-100">Learn from seniors and industry professionals</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-white/20 p-4 rounded-full mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Your Resume</h3>
              <p className="text-blue-100">AI-powered resume generator with multiple templates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;