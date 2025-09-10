-- Create enum types
CREATE TYPE public.user_type AS ENUM ('student', 'recruiter');
CREATE TYPE public.year_of_study AS ENUM ('1st', '2nd', '3rd', '4th');
CREATE TYPE public.internship_status AS ENUM ('open', 'closed', 'filled');
CREATE TYPE public.badge_type AS ENUM ('internship_star', 'mentor_star', 'coding_champ', 'top_performer');

-- Create students table
CREATE TABLE public.students (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    reg_number TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 30),
    cgpa DECIMAL(3,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
    year_of_study year_of_study NOT NULL,
    skills TEXT[] DEFAULT '{}',
    projects JSONB DEFAULT '[]',
    experience TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create recruiters table
CREATE TABLE public.recruiters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create OTP verification table
CREATE TABLE public.otp_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internships table
CREATE TABLE public.internships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recruiter_id UUID NOT NULL REFERENCES public.recruiters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    min_cgpa DECIMAL(3,2) DEFAULT 0,
    location TEXT,
    duration TEXT,
    stipend TEXT,
    status internship_status DEFAULT 'open',
    application_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create internship applications table
CREATE TABLE public.internship_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(student_id, internship_id)
);

-- Create mentorship connections table
CREATE TABLE public.mentorships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mentor_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(mentor_id, mentee_id)
);

-- Create badges table
CREATE TABLE public.badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    badge_type badge_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    awarded_by UUID REFERENCES public.recruiters(id),
    awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat rooms for mentorship
CREATE TABLE public.chat_rooms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    topic TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES public.students(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students
CREATE POLICY "Students can view their own profile" ON public.students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON public.students
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified student profiles for leaderboard" ON public.students
    FOR SELECT USING (is_verified = true);

CREATE POLICY "New students can insert their profile" ON public.students
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for recruiters
CREATE POLICY "Recruiters can view their own profile" ON public.recruiters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can update their own profile" ON public.recruiters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view verified student profiles" ON public.students
    FOR SELECT TO authenticated 
    USING (is_verified = true AND EXISTS (
        SELECT 1 FROM public.recruiters WHERE user_id = auth.uid() AND is_verified = true
    ));

CREATE POLICY "New recruiters can insert their profile" ON public.recruiters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for OTP verifications
CREATE POLICY "Anyone can insert OTP" ON public.otp_verifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view their own OTP" ON public.otp_verifications
    FOR SELECT USING (true);

-- Create RLS policies for internships
CREATE POLICY "Anyone can view open internships" ON public.internships
    FOR SELECT USING (status = 'open');

CREATE POLICY "Recruiters can manage their own internships" ON public.internships
    FOR ALL USING (EXISTS (
        SELECT 1 FROM public.recruiters WHERE id = recruiter_id AND user_id = auth.uid()
    ));

-- Create RLS policies for internship applications
CREATE POLICY "Students can view their own applications" ON public.internship_applications
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid()
    ));

CREATE POLICY "Students can create applications" ON public.internship_applications
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.students WHERE id = student_id AND user_id = auth.uid()
    ));

CREATE POLICY "Recruiters can view applications for their internships" ON public.internship_applications
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.internships i 
        JOIN public.recruiters r ON i.recruiter_id = r.id 
        WHERE i.id = internship_id AND r.user_id = auth.uid()
    ));

-- Create RLS policies for mentorships
CREATE POLICY "Students can view their mentorships" ON public.mentorships
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.students WHERE id = mentor_id AND user_id = auth.uid()
    ) OR EXISTS (
        SELECT 1 FROM public.students WHERE id = mentee_id AND user_id = auth.uid()
    ));

CREATE POLICY "Students can create mentorship connections" ON public.mentorships
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.students WHERE id = mentee_id AND user_id = auth.uid()
    ));

-- Create RLS policies for badges
CREATE POLICY "Anyone can view badges" ON public.badges
    FOR SELECT USING (true);

CREATE POLICY "Recruiters can award badges" ON public.badges
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.recruiters WHERE id = awarded_by AND user_id = auth.uid()
    ));

-- Create RLS policies for chat rooms
CREATE POLICY "Students can view active chat rooms" ON public.chat_rooms
    FOR SELECT USING (is_active = true);

CREATE POLICY "Students can create chat rooms" ON public.chat_rooms
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.students WHERE id = created_by AND user_id = auth.uid()
    ));

-- Create RLS policies for chat messages
CREATE POLICY "Students can view messages in active rooms" ON public.chat_messages
    FOR SELECT USING (EXISTS (
        SELECT 1 FROM public.chat_rooms WHERE id = room_id AND is_active = true
    ));

CREATE POLICY "Students can send messages" ON public.chat_messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Create indexes for better performance
CREATE INDEX idx_students_cgpa ON public.students(cgpa DESC);
CREATE INDEX idx_students_year ON public.students(year_of_study);
CREATE INDEX idx_students_skills ON public.students USING GIN(skills);
CREATE INDEX idx_internships_status ON public.internships(status);
CREATE INDEX idx_internships_skills ON public.internships USING GIN(required_skills);
CREATE INDEX idx_otp_email_expires ON public.otp_verifications(email, expires_at);
CREATE INDEX idx_chat_messages_room_time ON public.chat_messages(room_id, created_at DESC);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiters_updated_at
    BEFORE UPDATE ON public.recruiters
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
    BEFORE UPDATE ON public.internships
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate leaderboard
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count INTEGER DEFAULT 100)
RETURNS TABLE (
    student_id UUID,
    name TEXT,
    reg_number TEXT,
    cgpa DECIMAL,
    year_of_study year_of_study,
    skills TEXT[],
    badge_count BIGINT,
    rank INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH student_stats AS (
        SELECT 
            s.id,
            s.name,
            s.reg_number,
            s.cgpa,
            s.year_of_study,
            s.skills,
            COUNT(b.id) as badge_count
        FROM public.students s
        LEFT JOIN public.badges b ON s.id = b.student_id
        WHERE s.is_verified = true
        GROUP BY s.id, s.name, s.reg_number, s.cgpa, s.year_of_study, s.skills
    ),
    ranked_students AS (
        SELECT 
            *,
            ROW_NUMBER() OVER (ORDER BY cgpa DESC, badge_count DESC) as rank
        FROM student_stats
    )
    SELECT 
        rs.id,
        rs.name,
        rs.reg_number,
        rs.cgpa,
        rs.year_of_study,
        rs.skills,
        rs.badge_count,
        rs.rank::INTEGER
    FROM ranked_students rs
    WHERE rs.rank <= limit_count
    ORDER BY rs.rank;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;