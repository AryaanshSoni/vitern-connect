import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
  userData?: {
    name: string;
    regNumber?: string;
    age?: number;
    cgpa?: number;
    yearOfStudy?: string;
    skills?: string[];
    projects?: any[];
    experience?: string;
    company?: string;
    position?: string;
  };
  type: 'student' | 'recruiter';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, userData, type }: VerifyOTPRequest = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify OTP
    const { data: otpData, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('email', email)
      .eq('otp_code', otp)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpData) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Mark OTP as used
    await supabase
      .from('otp_verifications')
      .update({ is_used: true })
      .eq('id', otpData.id);

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: Math.random().toString(36).substring(2, 15), // Random password for security
      email_confirm: true,
    });

    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Failed to create user account" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Create profile based on user type
    if (type === 'student' && userData) {
      const { error: profileError } = await supabase
        .from('students')
        .insert({
          user_id: authData.user.id,
          name: userData.name,
          email,
          reg_number: userData.regNumber!,
          age: userData.age!,
          cgpa: userData.cgpa!,
          year_of_study: userData.yearOfStudy!,
          skills: userData.skills || [],
          projects: userData.projects || [],
          experience: userData.experience || '',
          is_verified: true,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return new Response(
          JSON.stringify({ error: "Failed to create student profile" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    } else if (type === 'recruiter' && userData) {
      const { error: profileError } = await supabase
        .from('recruiters')
        .insert({
          user_id: authData.user.id,
          name: userData.name,
          email,
          company: userData.company!,
          position: userData.position!,
          is_verified: true,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return new Response(
          JSON.stringify({ error: "Failed to create recruiter profile" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    // Generate sign-in link
    const { data: signInData, error: signInError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
    });

    if (signInError) {
      console.error("Sign-in link error:", signInError);
      return new Response(
        JSON.stringify({ error: "Account created but failed to generate sign-in link" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Account created successfully",
        user: authData.user,
        signInLink: signInData.properties?.action_link,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);