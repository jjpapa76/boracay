// 타입 정의

export interface Member {
  id?: number;
  email: string;
  password_hash?: string;
  name: string;
  phone?: string;
  birth_date?: string;
  nationality?: string;
  preferred_language?: string;
  role?: string;
  membership_type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
  profile_image_url?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface MembershipType {
  id?: number;
  name: string;
  name_ko: string;
  price: number;
  description?: string;
  description_ko?: string;
  features?: string;
  area_sqm?: number;
  area_pyeong?: number;
  max_occupancy?: number;
  floor_plans?: string;
  amenities?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PrePurchaseApplication {
  id?: number;
  member_id: number;
  membership_type_id: number;
  application_date?: string;
  preferred_floor?: number;
  preferred_orientation?: string;
  payment_method?: string;
  deposit_amount?: number;
  total_amount: number;
  status?: string;
  admin_notes?: string;
  approved_at?: string;
  approved_by?: number;
  contract_signed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Inquiry {
  id?: number;
  member_id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category?: string;
  status?: string;
  admin_response?: string;
  responded_at?: string;
  responded_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ActivityLog {
  id?: number;
  member_id?: number;
  action: string;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface Facility {
  id?: number;
  name: string;
  name_ko: string;
  category: string;
  description?: string;
  description_ko?: string;
  image_urls?: string;
  operating_hours?: string;
  capacity?: number;
  reservation_required?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Bindings {
  DB: D1Database;
}

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  exp?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  birth_date?: string;
  nationality?: string;
  preferred_language?: string;
}

export interface NewsletterSubscription {
  id?: number;
  email: string;
  name?: string;
  language?: string;
  subscribed_at?: string;
  unsubscribed_at?: string;
  is_active?: boolean;
}