import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Users, FileText, Trophy } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            VITERN
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#internships" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <BookOpen size={18} />
              Internships
            </Link>
            <Link to="#mentorship" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Users size={18} />
              Mentorship
            </Link>
            <Link to="#resume" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <FileText size={18} />
              Resume Builder
            </Link>
            <Link to="#leaderboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Trophy size={18} />
              Leaderboard
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/student/login">
              <Button variant="outline" className="btn-ghost-primary">
                Student Login
              </Button>
            </Link>
            <Link to="/recruiter/login">
              <Button className="btn-hero">
                Recruiter Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col space-y-4">
              <Link to="#internships" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <BookOpen size={18} />
                Internships
              </Link>
              <Link to="#mentorship" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Users size={18} />
                Mentorship
              </Link>
              <Link to="#resume" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <FileText size={18} />
                Resume Builder
              </Link>
              <Link to="#leaderboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                <Trophy size={18} />
                Leaderboard
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/student/login">
                  <Button variant="outline" className="btn-ghost-primary w-full">
                    Student Login
                  </Button>
                </Link>
                <Link to="/recruiter/login">
                  <Button className="btn-hero w-full">
                    Recruiter Login
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;