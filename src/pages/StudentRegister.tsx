import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, User, Hash, GraduationCap, Code, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const StudentRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    regNumber: "",
    age: "",
    cgpa: "",
    yearOfStudy: "1st",
    skills: "",
    projects: "",
    experience: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate VIT email
    if (!formData.email.endsWith("@vitstudent.ac.in")) {
      toast({
        title: "Invalid Email",
        description: "Please use your VIT student email (@vitstudent.ac.in)",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { email: formData.email, type: 'student' }
      });

      if (error) {
        throw error;
      }

      setStep(2);
      toast({
        title: "OTP Sent!",
        description: "Check your VIT email for the verification code"
      });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const skills = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const projects = formData.projects ? [{ description: formData.projects }] : [];

      const userData = {
        name: formData.name,
        regNumber: formData.regNumber,
        age: parseInt(formData.age),
        cgpa: parseFloat(formData.cgpa),
        yearOfStudy: formData.yearOfStudy,
        skills,
        projects,
        experience: formData.experience
      };

      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: {
          email: formData.email,
          otp: formData.otp,
          userData,
          type: 'student'
        }
      });

      if (error) {
        throw error;
      }

      // Sign in the user with the generated link
      if (data.signInLink) {
        const url = new URL(data.signInLink);
        const params = new URLSearchParams(url.hash.substring(1)); // Remove # and parse
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        
        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
        }
      }

      toast({
        title: "Registration Successful!",
        description: "Welcome to VITERN! Redirecting to your dashboard..."
      });

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-6 transition-colors">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > 1 ? <CheckCircle size={20} /> : "1"}
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              "2"
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">
              {step === 1 && "Verify Your VIT Email"}
              {step === 2 && "Complete Your Profile"}
            </CardTitle>
            <CardDescription className="text-lg">
              {step === 1 && "Enter your VIT student email to get started"}
              {step === 2 && "Enter verification code and complete your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Email Verification */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">VIT Student Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="yourname@vitstudent.ac.in"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full btn-hero py-3 text-lg" disabled={isLoading}>
                  {isLoading ? "Sending OTP..." : "Send Verification Code"}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Verification + Profile Completion */}
            {step === 2 && (
              <form onSubmit={handleOtpVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground font-medium">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => updateFormData("otp", e.target.value)}
                    className="py-3 rounded-xl border-2 focus:border-primary text-center text-2xl font-mono"
                    maxLength={6}
                    required
                  />
                </div>

                {/* Profile Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-muted-foreground" size={20} />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regNumber" className="text-foreground font-medium">Registration Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-muted-foreground" size={20} />
                      <Input
                        id="regNumber"
                        type="text"
                        placeholder="21BCE1234"
                        value={formData.regNumber}
                        onChange={(e) => updateFormData("regNumber", e.target.value)}
                        className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-foreground font-medium">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="20"
                      min="16"
                      max="30"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                      className="py-3 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cgpa" className="text-foreground font-medium">CGPA</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 text-muted-foreground" size={20} />
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="8.5"
                        value={formData.cgpa}
                        onChange={(e) => updateFormData("cgpa", e.target.value)}
                        className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="yearOfStudy" className="text-foreground font-medium">Year of Study</Label>
                    <Select value={formData.yearOfStudy} onValueChange={(value) => updateFormData("yearOfStudy", value)}>
                      <SelectTrigger className="py-3 rounded-xl border-2 focus:border-primary">
                        <SelectValue placeholder="Select your year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-foreground font-medium">Skills</Label>
                  <div className="relative">
                    <Code className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="skills"
                      type="text"
                      placeholder="React, Python, Machine Learning, etc. (comma-separated)"
                      value={formData.skills}
                      onChange={(e) => updateFormData("skills", e.target.value)}
                      className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="projects" className="text-foreground font-medium">Projects</Label>
                  <Textarea
                    id="projects"
                    placeholder="Describe your key projects..."
                    value={formData.projects}
                    onChange={(e) => updateFormData("projects", e.target.value)}
                    className="py-3 rounded-xl border-2 focus:border-primary min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-foreground font-medium">Experience (Optional)</Label>
                  <Textarea
                    id="experience"
                    placeholder="Internships, part-time work, etc."
                    value={formData.experience}
                    onChange={(e) => updateFormData("experience", e.target.value)}
                    className="py-3 rounded-xl border-2 focus:border-primary min-h-[100px]"
                  />
                </div>
                
                <Button type="submit" className="w-full btn-hero py-3 text-lg" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Button>
              </form>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/student/login" className="text-primary hover:text-primary-dark font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegister;