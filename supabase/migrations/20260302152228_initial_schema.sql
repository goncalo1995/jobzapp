-- JobZapp Core Schema Migration
-- Based on plan.md specifications

-- 1. Organizations & Contacts
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (name, created_by)
);

CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT,
    email TEXT,
    linkedin TEXT,
    notes TEXT,
    last_interaction TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interaction_type') THEN
        CREATE TYPE public.interaction_type AS ENUM ('Email', 'Call', 'LinkedIn', 'Interview', 'Follow-up');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    type public.interaction_type NOT NULL,
    interaction_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    follow_up_date TIMESTAMPTZ,
    follow_up_completed BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles & CVs
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    raw_bio TEXT,
    parsed_data JSONB, -- skills, workExperience, education, achievements
    job_search_preferences JSONB, -- preferredRoles, preferredLocations, etc.
    default_cv_id UUID, -- Circular reference handled later
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_default_cv FOREIGN KEY (default_cv_id) REFERENCES public.cvs(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_default BOOLEAN DEFAULT FALSE,
    target_role TEXT,
    base_on_profile_id UUID REFERENCES public.user_profiles(id),
    content TEXT,
    pdf_url TEXT,
    markdown_content TEXT,
    ats_keywords TEXT[],
    success_rate NUMERIC,
    metadata JSONB DEFAULT '{ "usedCount": 0 }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Job Applications & Timeline
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE public.application_status AS ENUM (
            'Wishlist', 'Applied', 'Pending Review', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    company_name_denormalized TEXT,
    position TEXT NOT NULL,
    job_description TEXT,
    job_url TEXT,
    location TEXT,
    flexibility TEXT, -- 'Remote', 'On-site', 'Hybrid'
    min_salary NUMERIC,
    max_salary NUMERIC,
    salary_currency TEXT DEFAULT 'USD',
    benefits TEXT[],
    status public.application_status DEFAULT 'Wishlist',
    applied_date TIMESTAMPTZ,
    source TEXT,
    source_board TEXT,
    cv_id UUID REFERENCES public.cvs(id),
    cv_snapshot TEXT,
    cover_letter_id UUID, -- Circular handled later
    cover_letter_snapshot TEXT,
    match_score NUMERIC,
    notes TEXT,
    tags TEXT[],
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    next_follow_up TIMESTAMPTZ,
    response_time INTEGER, -- Days
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_cover_letter FOREIGN KEY (cover_letter_id) REFERENCES public.cover_letters(id) ON DELETE SET NULL
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'interview_type') THEN
        CREATE TYPE public.interview_type AS ENUM (
            'Phone Screen', 'Technical', 'HR', 'Hiring Manager', 'Panel', 'Final', 'Take-home'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    type public.interview_type NOT NULL,
    round INTEGER,
    interview_date TIMESTAMPTZ,
    duration INTEGER, -- Minutes
    interviewer_ids UUID[], -- Link to contacts
    interviewer_names TEXT[],
    format TEXT, -- 'Video', 'Phone', 'In-person', 'Take-home'
    preparation_notes TEXT,
    questions_asked TEXT[],
    your_questions TEXT[],
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    next_steps TEXT,
    follow_up_sent BOOLEAN DEFAULT FALSE,
    follow_up_date TIMESTAMPTZ,
    star_stories JSONB, -- Array of {situation, task, action, result}
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Offers & Cover Letters
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'offer_status') THEN
        CREATE TYPE public.offer_status AS ENUM ('Pending', 'Accepted', 'Declined', 'Negotiating', 'Expired');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.job_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    status public.offer_status DEFAULT 'Pending',
    extended_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    response_date TIMESTAMPTZ,
    base_salary NUMERIC,
    base_salary_currency TEXT DEFAULT 'USD',
    equity TEXT,
    bonus TEXT,
    signing_bonus NUMERIC,
    relocation_package TEXT,
    benefits TEXT[],
    vacation_days INTEGER,
    remote_policy TEXT,
    pros TEXT[],
    cons TEXT[],
    comparison_score NUMERIC,
    initial_offer TEXT,
    counter_offer TEXT,
    final_offer TEXT,
    negotiation_notes TEXT,
    decision_rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cover_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_application_id UUID REFERENCES public.job_applications(id) ON DELETE CASCADE,
    cv_id UUID REFERENCES public.cvs(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    tone TEXT,
    key_points TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Helper Functions & Triggers (Automated updated_at)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_contacts_updated_at ON public.contacts;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_cvs_updated_at ON public.cvs;
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON public.job_applications;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cvs_updated_at BEFORE UPDATE ON public.cvs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. RLS (Basic - Users own their data)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies (Complete)

-- USER PROFILES (already done, included for completeness)
DROP POLICY IF EXISTS "Users can create own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
CREATE POLICY "Users can create own profile" ON public.user_profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own profile" ON public.user_profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles 
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.user_profiles 
    FOR DELETE USING (auth.uid() = id);

-- CVS
DROP POLICY IF EXISTS "Users can create own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can view own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can update own CVs" ON public.cvs;
DROP POLICY IF EXISTS "Users can delete own CVs" ON public.cvs;
CREATE POLICY "Users can create own CVs" ON public.cvs 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own CVs" ON public.cvs 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own CVs" ON public.cvs 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own CVs" ON public.cvs 
    FOR DELETE USING (auth.uid() = user_id);

-- JOB APPLICATIONS
DROP POLICY IF EXISTS "Users can create own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can view own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can update own job applications" ON public.job_applications;
DROP POLICY IF EXISTS "Users can delete own job applications" ON public.job_applications;
CREATE POLICY "Users can create own job applications" ON public.job_applications 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own job applications" ON public.job_applications 
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own job applications" ON public.job_applications 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own job applications" ON public.job_applications 
    FOR DELETE USING (auth.uid() = user_id);

-- INTERVIEWS (access via job application)
DROP POLICY IF EXISTS "Users can create interviews for own jobs" ON public.interviews;
DROP POLICY IF EXISTS "Users can view interviews for own jobs" ON public.interviews;
DROP POLICY IF EXISTS "Users can update interviews for own jobs" ON public.interviews;
DROP POLICY IF EXISTS "Users can delete interviews for own jobs" ON public.interviews;
CREATE POLICY "Users can create interviews for own jobs" ON public.interviews 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can view interviews for own jobs" ON public.interviews 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update interviews for own jobs" ON public.interviews 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete interviews for own jobs" ON public.interviews 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );

-- JOB OFFERS (access via job application)
DROP POLICY IF EXISTS "Users can create offers for own jobs" ON public.job_offers;
DROP POLICY IF EXISTS "Users can view offers for own jobs" ON public.job_offers;
DROP POLICY IF EXISTS "Users can update offers for own jobs" ON public.job_offers;
DROP POLICY IF EXISTS "Users can delete offers for own jobs" ON public.job_offers;
CREATE POLICY "Users can create offers for own jobs" ON public.job_offers 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can view offers for own jobs" ON public.job_offers 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update offers for own jobs" ON public.job_offers 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete offers for own jobs" ON public.job_offers 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );

-- COVER LETTERS (access via job application)
DROP POLICY IF EXISTS "Users can create cover letters for own jobs" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can view cover letters for own jobs" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can update cover letters for own jobs" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can delete cover letters for own jobs" ON public.cover_letters;
CREATE POLICY "Users can create cover letters for own jobs" ON public.cover_letters 
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can view cover letters for own jobs" ON public.cover_letters 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update cover letters for own jobs" ON public.cover_letters 
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete cover letters for own jobs" ON public.cover_letters 
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE id = job_application_id AND user_id = auth.uid()
        )
    );


-- Companies RLS
DROP POLICY IF EXISTS "Anyone can view public companies" ON public.companies;
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
DROP POLICY IF EXISTS "Creators can update their companies" ON public.companies;
DROP POLICY IF EXISTS "Creators can delete their companies" ON public.companies;
CREATE POLICY "Anyone can view public companies" ON public.companies 
    FOR SELECT USING (is_public = true OR created_by = auth.uid());
    
CREATE POLICY "Users can create companies" ON public.companies 
    FOR INSERT WITH CHECK (auth.uid() = created_by);
    
CREATE POLICY "Creators can update their companies" ON public.companies 
    FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());
    
CREATE POLICY "Creators can delete their companies" ON public.companies 
    FOR DELETE USING (created_by = auth.uid());

-- CONTACTS (access via company or job application)
DROP POLICY IF EXISTS "Users can view contacts from their applications" ON public.contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can update own contacts" ON public.contacts;
DROP POLICY IF EXISTS "Users can delete own contacts" ON public.contacts;
CREATE POLICY "Users can view contacts from their applications" ON public.contacts 
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE company_id = contacts.company_id AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.interviews 
            WHERE interviewer_ids @> ARRAY[contacts.id]::UUID[] 
            AND job_application_id IN (
                SELECT id FROM public.job_applications WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create contacts" ON public.contacts 
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own contacts" ON public.contacts 
    FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own contacts" ON public.contacts 
    FOR DELETE USING (created_by = auth.uid());

-- INTERACTIONS (access via contact)
DROP POLICY IF EXISTS "Users can view interactions for their contacts" ON public.interactions;
DROP POLICY IF EXISTS "Users can create interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can update own interactions" ON public.interactions;
DROP POLICY IF EXISTS "Users can delete own interactions" ON public.interactions;
CREATE POLICY "Users can view interactions for their contacts" ON public.interactions 
    FOR SELECT USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.contacts 
            WHERE id = interactions.contact_id 
            AND (created_by = auth.uid() OR EXISTS (
                SELECT 1 FROM public.job_applications 
                WHERE company_id = contacts.company_id AND user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Users can create interactions" ON public.interactions 
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own interactions" ON public.interactions 
    FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own interactions" ON public.interactions 
    FOR DELETE USING (created_by = auth.uid());

-- 7. Additional Helper Policies for Better UX

-- Allow users to view companies they've applied to even if not public
DROP POLICY IF EXISTS "Users can view companies they applied to" ON public.companies;
CREATE POLICY "Users can view companies they applied to" ON public.companies 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE company_id = companies.id AND user_id = auth.uid()
        )
    );

-- Allow users to view contacts from companies they've applied to
DROP POLICY IF EXISTS "Users can view contacts from applied companies" ON public.contacts;
CREATE POLICY "Users can view contacts from applied companies" ON public.contacts 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.job_applications 
            WHERE company_id = contacts.company_id AND user_id = auth.uid()
        )
    );

-- 8. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_company_id ON public.job_applications(company_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_date ON public.job_applications(applied_date);

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_is_default ON public.cvs(is_default) WHERE is_default = true;

CREATE INDEX IF NOT EXISTS idx_interviews_job_application_id ON public.interviews(job_application_id);
CREATE INDEX IF NOT EXISTS idx_interviews_interview_date ON public.interviews(interview_date);

CREATE INDEX IF NOT EXISTS idx_job_offers_job_application_id ON public.job_offers(job_application_id);
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status);

CREATE INDEX IF NOT EXISTS idx_cover_letters_job_application_id ON public.cover_letters(job_application_id);

CREATE INDEX IF NOT EXISTS idx_companies_name ON public.companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON public.companies(created_by);

CREATE INDEX IF NOT EXISTS idx_contacts_company_id ON public.contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_created_by ON public.contacts(created_by);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON public.contacts(name);

CREATE INDEX IF NOT EXISTS idx_interactions_contact_id ON public.interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_interactions_follow_up_date ON public.interactions(follow_up_date) WHERE follow_up_completed = false;