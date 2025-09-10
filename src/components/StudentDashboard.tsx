import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, FileText, Trophy, Star, Medal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  student_id: string;
  name: string;
  reg_number: string;
  cgpa: number;
  year_of_study: string;
  skills: string[];
  badge_count: number;
  rank: number;
}

const StudentDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase.rpc('get_leaderboard', { limit_count: 10 });
      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboard(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="text-yellow-500" size={20} />;
    if (rank === 2) return <Medal className="text-gray-400" size={20} />;
    if (rank === 3) return <Medal className="text-orange-600" size={20} />;
    return <span className="font-bold text-muted-foreground">#{rank}</span>;
  };

  if (!userProfile) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Welcome back, {userProfile.name}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            {userProfile.reg_number} • {userProfile.year_of_study} Year • CGPA: {userProfile.cgpa}
          </p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Briefcase className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Internships</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-secondary/10 p-3 rounded-xl">
              <Users className="text-secondary" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Mentors</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-accent/10 p-3 rounded-xl">
              <FileText className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resume Status</p>
              <p className="text-xl font-bold text-green-600">Ready</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-xl">
              <Trophy className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold">Coming Soon</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-primary" size={20} />
              Your Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {userProfile.skills?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p className="text-sm text-muted-foreground">
                {userProfile.experience || "No experience added yet"}
              </p>
            </div>

            <Button className="w-full" variant="outline">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="ghost">
              <Briefcase className="mr-2" size={16} />
              Browse Internships
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Users className="mr-2" size={16} />
              Find Mentors
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <FileText className="mr-2" size={16} />
              Generate Resume
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Trophy className="mr-2" size={16} />
              View Leaderboard
            </Button>
          </CardContent>
        </Card>

        {/* Top 10 Leaderboard */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={20} />
              Top 10 Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-muted-foreground">Loading...</p>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((student) => (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center space-x-3">
                      {getRankIcon(student.rank)}
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          CGPA: {student.cgpa} • {student.year_of_study} Year
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{student.badge_count} badges</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activities. Start exploring internships and connecting with mentors!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;