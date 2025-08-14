-- 실버타운 데이터베이스 스키마

-- 회원 테이블
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  birth_date DATE,
  nationality TEXT DEFAULT 'KR',
  preferred_language TEXT DEFAULT 'ko',
  role TEXT DEFAULT 'member', -- member, admin, manager
  membership_type TEXT, -- basic, premium, vip
  status TEXT DEFAULT 'pending', -- pending, active, inactive, suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME,
  profile_image_url TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT
);

-- 회원권 유형 테이블
CREATE TABLE IF NOT EXISTS membership_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  price INTEGER NOT NULL, -- 원 단위
  description TEXT,
  description_ko TEXT,
  features TEXT, -- JSON 형태
  area_sqm INTEGER, -- 평수 (제곱미터)
  area_pyeong REAL, -- 평수 (평)
  max_occupancy INTEGER DEFAULT 2,
  floor_plans TEXT, -- JSON 형태로 평면도 정보
  amenities TEXT, -- JSON 형태로 편의시설 정보
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 사전 구매 신청 테이블
CREATE TABLE IF NOT EXISTS pre_purchase_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  membership_type_id INTEGER NOT NULL,
  application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  preferred_floor INTEGER,
  preferred_orientation TEXT, -- 'ocean_view', 'mountain_view', 'garden_view'
  payment_method TEXT, -- 'full_payment', 'installment'
  deposit_amount INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  admin_notes TEXT,
  approved_at DATETIME,
  approved_by INTEGER,
  contract_signed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (membership_type_id) REFERENCES membership_types(id),
  FOREIGN KEY (approved_by) REFERENCES members(id)
);

-- 문의사항 테이블
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, membership, facilities, investment
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed
  admin_response TEXT,
  responded_at DATETIME,
  responded_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (responded_by) REFERENCES members(id)
);

-- 활동 로그 테이블
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);

-- 뉴스레터 구독 테이블
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'ko',
  subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME,
  is_active BOOLEAN DEFAULT 1
);

-- 시설 정보 테이블
CREATE TABLE IF NOT EXISTS facilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  category TEXT NOT NULL, -- 'recreation', 'healthcare', 'dining', 'wellness'
  description TEXT,
  description_ko TEXT,
  image_urls TEXT, -- JSON 배열
  operating_hours TEXT,
  capacity INTEGER,
  reservation_required BOOLEAN DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_pre_purchase_member_id ON pre_purchase_applications(member_id);
CREATE INDEX IF NOT EXISTS idx_pre_purchase_status ON pre_purchase_applications(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_member_id ON inquiries(member_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_member_id ON activity_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);