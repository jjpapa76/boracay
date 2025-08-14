-- 실버타운 기본 데이터 삽입

-- 기본 관리자 계정 (패스워드: admin123 - 실제로는 해시화됨)
INSERT OR IGNORE INTO members (email, password_hash, name, role, status) VALUES 
  ('admin@boracay-silvertown.com', '$2b$10$example.hash.for.admin123', 'System Admin', 'admin', 'active'),
  ('manager@boracay-silvertown.com', '$2b$10$example.hash.for.manager123', 'Site Manager', 'manager', 'active');

-- 회원권 유형 데이터
INSERT OR IGNORE INTO membership_types (name, name_ko, price, description, description_ko, area_sqm, area_pyeong, max_occupancy, features, amenities) VALUES 
  ('Studio Premium', '스튜디오 프리미엄', 150000000, 'Compact luxury studio with ocean view', '오션뷰를 자랑하는 컴팩트한 럭셔리 스튜디오', 45, 13.6, 2, 
   '["Ocean view", "Premium interior", "Smart home system", "24/7 concierge"]',
   '["Private balcony", "Walk-in closet", "Premium kitchen", "Marble bathroom"]'),
   
  ('One Bedroom Deluxe', '원룸 디럭스', 220000000, 'Spacious one-bedroom with premium amenities', '프리미엄 어메니티를 갖춘 넓은 원룸', 65, 19.7, 2,
   '["Ocean view", "Separate bedroom", "Premium interior", "Smart home system", "24/7 concierge"]',
   '["Private balcony", "Walk-in closet", "Premium kitchen", "Marble bathroom", "Study room"]'),
   
  ('Two Bedroom Royal', '투룸 로열', 320000000, 'Royal suite with panoramic ocean view', '파노라믹 오션뷰를 자랑하는 로열 스위트', 85, 25.7, 4,
   '["Panoramic ocean view", "Two bedrooms", "Premium interior", "Smart home system", "24/7 concierge", "Private elevator access"]',
   '["Private large balcony", "Master walk-in closet", "Premium kitchen", "Two marble bathrooms", "Living room", "Dining area"]'),
   
  ('Penthouse Presidential', '펜트하우스 프레지덴셜', 500000000, 'Ultimate luxury penthouse with private terrace', '프라이빗 테라스를 갖춘 최고급 펜트하우스', 120, 36.3, 6,
   '["360-degree ocean view", "Private terrace", "Three bedrooms", "Premium interior", "Smart home system", "24/7 concierge", "Private elevator", "Helicopter pad access"]',
   '["Private rooftop terrace", "Master suite with walk-in closet", "Gourmet kitchen", "Three marble bathrooms", "Living room", "Dining area", "Home office", "Private gym"]');

-- 시설 정보 데이터
INSERT OR IGNORE INTO facilities (name, name_ko, category, description, description_ko, operating_hours, capacity, reservation_required) VALUES 
  ('Infinity Pool', '인피니티 풀', 'recreation', 'Luxury infinity pool overlooking the ocean', '바다를 내려다보는 럭셔리 인피니티 풀', '06:00-22:00', 50, 0),
  ('Spa & Wellness Center', '스파 & 웰니스 센터', 'wellness', 'Full-service spa with traditional Korean treatments', '전통 한국식 트리트먼트를 제공하는 풀서비스 스파', '08:00-21:00', 20, 1),
  ('Private Marina', '프라이빗 마리나', 'recreation', 'Exclusive marina for residents with yacht services', '요트 서비스를 제공하는 입주자 전용 마리나', '24/7', 30, 1),
  ('Helipad', '헬리패드', 'transportation', 'Private helipad for convenient transportation', '편리한 교통을 위한 프라이빗 헬리패드', '24/7', 2, 1),
  ('Korean Traditional Garden', '한국 전통 정원', 'recreation', 'Beautiful Korean-style garden for meditation and relaxation', '명상과 휴식을 위한 아름다운 한국식 정원', '24/7', 100, 0),
  ('Fine Dining Restaurant', '파인 다이닝 레스토랑', 'dining', 'Michelin-level cuisine with Korean and international menu', '한식과 세계 요리를 제공하는 미슐랭 수준의 레스토랑', '18:00-23:00', 80, 1),
  ('Health & Fitness Center', '헬스 & 피트니스 센터', 'healthcare', 'State-of-the-art fitness facility with personal trainers', '개인 트레이너가 있는 최첨단 피트니스 시설', '05:00-23:00', 40, 0),
  ('Library & Study Lounge', '도서관 & 스터디 라운지', 'recreation', 'Quiet space for reading and intellectual activities', '독서와 지적 활동을 위한 조용한 공간', '24/7', 30, 0),
  ('Art Gallery', '아트 갤러리', 'recreation', 'Rotating exhibitions of Korean and international artists', '한국과 국제 작가들의 순환 전시', '10:00-18:00', 50, 0),
  ('Medical Clinic', '의료 클리닉', 'healthcare', '24/7 medical services with Korean and English speaking staff', '한국어와 영어 구사 직원이 있는 24/7 의료 서비스', '24/7', 10, 1);

-- 샘플 문의사항
INSERT OR IGNORE INTO inquiries (name, email, phone, subject, message, category) VALUES 
  ('김영수', 'kim@example.com', '+82-10-1234-5678', '회원권 문의', '펜트하우스 타입에 대해 자세한 정보를 알고 싶습니다.', 'membership'),
  ('John Smith', 'john@example.com', '+1-555-123-4567', 'Investment Inquiry', 'I am interested in learning more about the investment opportunities.', 'investment'),
  ('박미영', 'park@example.com', '+82-10-9876-5432', '시설 문의', '스파 시설 이용 방법에 대해 궁금합니다.', 'facilities');

-- 뉴스레터 구독 샘플
INSERT OR IGNORE INTO newsletter_subscriptions (email, name, language) VALUES 
  ('subscriber1@example.com', '구독자1', 'ko'),
  ('subscriber2@example.com', 'Subscriber 2', 'en'),
  ('subscriber3@example.com', '구독자3', 'ko');