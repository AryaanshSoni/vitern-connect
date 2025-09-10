import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold mb-4">VITERN</h3>
            <p className="text-blue-200 mb-6 max-w-md">
              Empowering VIT students to connect with opportunities, mentors, and build successful careers. 
              Your journey to professional success starts here.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#internships" className="text-blue-200 hover:text-white transition-colors">
                  Find Internships
                </Link>
              </li>
              <li>
                <Link to="#mentorship" className="text-blue-200 hover:text-white transition-colors">
                  Mentorship
                </Link>
              </li>
              <li>
                <Link to="#resume" className="text-blue-200 hover:text-white transition-colors">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="#leaderboard" className="text-blue-200 hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-blue-200">
                <Mail size={16} />
                <span>support@vitern.ac.in</span>
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-blue-200">
                <MapPin size={16} />
                <span>VIT, Vellore, Tamil Nadu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Future Scope Section */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <h4 className="text-xl font-semibold mb-4 text-center">Future Scope</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="text-blue-200">
              <strong>AI Career Guidance:</strong> Personalized roadmaps for skill development
            </div>
            <div className="text-blue-200">
              <strong>Skill Gap Analysis:</strong> Identify and bridge professional skill gaps
            </div>
            <div className="text-blue-200">
              <strong>Smart Matching:</strong> AI-powered internship recommendations
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-blue-200">
            © 2024 VITERN. Built for VIT students, by VIT students. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;