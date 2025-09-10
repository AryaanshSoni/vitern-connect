import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, Lock, ArrowLeft, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecruiterLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      toast({
        title: "Login Successful!",
        description: "Welcome to VITERN Recruiter Dashboard"
      });
      setIsLoading(false);
      // Redirect to recruiter dashboard would happen here
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Login Card */}
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Recruiter Login</CardTitle>
            <CardDescription className="text-lg">
              Access your recruiter dashboard to find top VIT talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="recruiter@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="/recruiter/forgot-password" className="text-primary hover:text-primary-dark text-sm">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full btn-hero py-3 text-lg" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/recruiter/register" className="text-primary hover:text-primary-dark font-medium">
                  Register here
                </Link>
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mt-8 p-4 bg-primary/5 rounded-xl">
              <h4 className="font-semibold text-primary mb-2">Why Choose VITERN?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access to VIT's top talent pool</li>
                <li>• Filter by skills, CGPA, and experience</li>
                <li>• Direct resume access and communication</li>
                <li>• Award recognition badges to students</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterLogin;