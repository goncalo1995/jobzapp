import type { Database } from "@/types/database.types";

export type Company = Database['public']['Tables']['companies']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type Interaction = Database['public']['Tables']['interactions']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type CV = Database['public']['Tables']['cvs']['Row']
export type JobApplication = Database['public']['Tables']['job_applications']['Row']
export type Interview = Database['public']['Tables']['interviews']['Row']
export type JobOffer = Database['public']['Tables']['job_offers']['Row']
export type CoverLetter = Database['public']['Tables']['cover_letters']['Row']

export type ApplicationStatus = Database['public']['Enums']['application_status']
export type InterviewType = Database['public']['Enums']['interview_type']
