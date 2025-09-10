import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, User, Building, Phone, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecruiterRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    name: "",
    company: "",
    position: "",
    phone: "",
    companyDescription: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate sending OTP
    setTimeout(() => {
      setStep(2);
      toast({
        title: "OTP Sent!",
        description: "Check your email for the verification code"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setStep(3);
      toast({
        title: "Email Verified!",
        description: "Now complete your recruiter profile"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: "Welcome to VITERN! You can now access your recruiter dashboard."
      });
      setIsLoading(false);
    }, 2000);
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
              {step > 2 ? <CheckCircle size={20} /> : "2"}
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              {step > 3 ? <CheckCircle size={20} /> : "3"}
            </div>
          </div>
        </div>

        {/* Registration Card */}
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
              <Building className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">
              {step === 1 && "Verify Your Email"}
              {step === 2 && "Enter Verification Code"}
              {step === 3 && "Complete Your Profile"}
            </CardTitle>
            <CardDescription className="text-lg">
              {step === 1 && "Enter your email to get started as a recruiter"}
              {step === 2 && "We've sent a verification code to your email"}
              {step === 3 && "Tell us about your company to complete registration"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Email Verification */}
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Company Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="recruiter@company.com"
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

            {/* Step 2: OTP Verification */}
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
                <Button type="submit" className="w-full btn-hero py-3 text-lg" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>
            )}

            {/* Step 3: Profile Completion */}
            {step === 3 && (
              <form onSubmit={handleRegistration} className="space-y-6">
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
                    <Label htmlFor="company" className="text-foreground font-medium">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 text-muted-foreground" size={20} />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Acme Corp"
                        value={formData.company}
                        onChange={(e) => updateFormData("company", e.target.value)}
                        className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-foreground font-medium">Your Position</Label>
                    <Input
                      id="position"
                      type="text"
                      placeholder="HR Manager"
                      value={formData.position}
                      onChange={(e) => updateFormData("position", e.target.value)}
                      className="py-3 rounded-xl border-2 focus:border-primary"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-muted-foreground" size={20} />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => updateFormData("phone", e.target.value)}
                        className="pl-10 py-3 rounded-xl border-2 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyDescription" className="text-foreground font-medium">Company Description</Label>
                  <Textarea
                    id="companyDescription"
                    placeholder="Tell us about your company, what you do, and what kind of talent you're looking for..."
                    value={formData.companyDescription}
                    onChange={(e) => updateFormData("companyDescription", e.target.value)}
                    className="py-3 rounded-xl border-2 focus:border-primary min-h-[120px]"
                    required
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
                <Link to="/recruiter/login" className="text-primary hover:text-primary-dark font-medium">
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

export default RecruiterRegister;