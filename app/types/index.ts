export interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  alternate_phone?: string;
  program_of_interest_id?: number;
  program_category_id?: number;
  education_level?: string;
  current_city?: string;
  state?: string;
  preferred_intake?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost' | 'duplicate';
  assigned_to?: string;
  notes?: string;
  consent_email: boolean;
  consent_phone: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: Date | string;
  updated_at: Date | string;
  program?: Program;
  category?: ProgramCategory;
}

export interface Program {
  id: number;
  category_id?: number;
  title: string;
  slug: string;
  description?: string;
  level?: string;
  duration?: string;
  eligibility_criteria?: string;
  fee_range?: string;
  is_active: boolean;
  featured: boolean;
  display_order: number;
  created_at: Date | string;
  updated_at: Date | string;
  category?: ProgramCategory;
}

export interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface LeadActivity {
  id: number;
  lead_id: number;
  activity_type: string;
  description?: string;
  performed_by?: string;
  metadata?: any;
  created_at: Date | string;
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  programCategoryId?: number;
  programId?: number;
  educationLevel?: string;
  city?: string;
  state?: string;
  preferredIntake?: string;
  message?: string;
  consentEmail: boolean;
  consentPhone: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  topPrograms: Array<{ program: string; count: number }>;
  leadsByStatus: Array<{ status: string; count: number }>;
  leadsByLevel: Array<{ level: string; count: number }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
