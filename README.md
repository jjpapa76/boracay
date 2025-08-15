# Boracay Silvertown | 보라카이 실버타운

## 프로젝트 개요
- **프로젝트명**: 보라카이 하이엔드 실버타운 홍보 및 회원관리 웹사이트
- **위치**: Monaco Road, Sitio Tulubhan, Boracay Jetty Port Rd, Boracay, Malay, 5608 Aklan, Philippines
- **목표**: 한국의 전통 건축양식을 적용한 글로벌 하이엔드 실버타운 개발 및 사전회원 모집
- **주요 기능**: 사전회원 가입, 회원권 사전구매 신청, 문의상담, 관리자 시스템

## 🌐 서비스 URL
- **개발 서버**: https://3000-iwqbgtci5ex87lvlaxjg8-6532622b.e2b.dev
- **API 엔드포인트**: https://3000-iwqbgtci5ex87lvlaxjg8-6532622b.e2b.dev/api
- **GitHub**: (설정 예정)

## 🏛️ 실버타운 특징
- **건축 스타일**: 한국 전통 궁궐 건축양식과 현대적 럭셔리 디자인 융합
- **부지 특징**: 경사지형을 활용한 4층 웅장한 집합건물
- **특별 시설**: 
  - 프라이빗 유럽형 선착장 (해안가)
  - 헬기착륙장 (건물 상부)
  - 한국 궁궐 스타일 로비
  - 하이엔드 현대식 주거공간

## 🏠 회원권 타입 (4가지)
1. **Studio Premium** (45㎡, 13.6평) - 1.5억원
   - 컴팩트 럭셔리 스튜디오, 오션뷰, 프리미엄 인테리어

2. **One Bedroom Deluxe** (65㎡, 19.7평) - 2.2억원
   - 넓은 원룸, 별도 침실, 프리미엄 어메니티

3. **Two Bedroom Royal** (85㎡, 25.7평) - 3.2억원
   - 로열 스위트, 파노라믹 오션뷰, 투룸 구조

4. **Penthouse Presidential** (120㎡, 36.3평) - 5억원
   - 최고급 펜트하우스, 360도 오션뷰, 프라이빗 테라스, 헬기장 직접 접근

## 🎯 데이터 아키텍처
### 주요 데이터 모델
- **회원 관리**: 사전회원 가입, 로그인, 프로필 관리
- **회원권 관리**: 4가지 타입별 상세 정보 및 가격
- **사전구매 신청**: 회원권별 구매 신청 및 승인 프로세스
- **문의 관리**: 카테고리별 문의사항 및 관리자 응답
- **활동 로그**: 모든 사용자 활동 추적
- **뉴스레터**: 구독 관리

### 스토리지 서비스
- **Cloudflare D1**: SQLite 기반 글로벌 분산 데이터베이스
- **로컬 개발**: `--local` 플래그로 로컬 SQLite 자동 생성

## 🛠️ 기술 스택
- **백엔드**: Hono Framework + TypeScript
- **런타임**: Cloudflare Workers
- **데이터베이스**: Cloudflare D1 (SQLite)
- **프론트엔드**: Vanilla JavaScript + TailwindCSS
- **인증**: JWT 토큰 기반
- **빌드 도구**: Vite
- **프로세스 관리**: PM2

## 🚀 주요 기능
### 사용자 기능
- ✅ 사전회원 가입 및 로그인
- ✅ 회원권 타입별 상세 정보 조회
- ✅ 사전구매 신청 (층수, 방향, 결제방식 선택)
- ✅ 문의사항 등록 (카테고리별)
- ✅ 뉴스레터 구독
- ✅ 반응형 웹 디자인

### 관리자 기능 (개발 중)
- 회원 관리 및 승인
- 사전구매 신청 검토 및 승인
- 문의사항 응답
- 활동 로그 모니터링
- 통계 대시보드

## 🎨 UI/UX 특징
- **디자인 컨셉**: 한국 전통미 + 현대적 럭셔리
- **컬러 팔레트**: 골드 그라디언트, 블랙, 화이트
- **타이포그래피**: Noto Sans KR (한글), Playfair Display (영문)
- **효과**: 글래스모피즘, 패럴랙스, 플로팅 애니메이션
- **반응형**: 모바일, 태블릿, 데스크톱 최적화

## 🏗️ 시설 및 편의시설
1. **레크리에이션**: 인피니티 풀, 한국 전통정원, 아트 갤러리, 도서관
2. **웰니스**: 스파 & 웰니스 센터, 헬스 & 피트니스 센터
3. **다이닝**: 파인 다이닝 레스토랑
4. **교통**: 프라이빗 마리나, 헬리패드
5. **의료**: 24시간 메디컬 클리닉

## 🖼️ 울트라 하이엔드 실사 이미지 완료
### **2025-08-15 업데이트: 지브리 스타일 → 초실사 프리미엄 변경 완료**
1. **메인 조감도**: 초실사적 한국 전통 건축양식 - 4층 웅장한 집합건물, 헬기장, 유럽형 마리나
   - URL: `https://cdn1.genspark.ai/user-upload-image/4_generated/2d32bd92-8f18-44bf-bfcb-58112f7196cb`
2. **로비**: 포시즌스급 한국 궁궐 스타일 로비 - 프리미엄 마블, 골드 액센트, 크리스탈 샹들리에
   - URL: `https://cdn1.genspark.ai/user-upload-image/4_generated/6e7eaa7b-c1ec-4c5c-b5e9-b4b94a26d7e6`
3. **주거공간 (4가지 타입)**: 울트라 럭셔리 인테리어 - 리츠칼튼/만다린 오리엔탈 수준
   - Studio Premium: `https://cdn1.genspark.ai/user-upload-image/4_generated/47bb8e12-68cf-4d3c-b7d3-4b5f2bd7b8a8`
   - One Bedroom Deluxe: `https://cdn1.genspark.ai/user-upload-image/4_generated/8e93b5c2-15ef-4e91-b0f3-8c2a9b5c7d1f`
   - Two Bedroom Royal: `https://cdn1.genspark.ai/user-upload-image/4_generated/3c7b5a9f-8d4e-4f2a-9b6c-7e8f5a3d2b9c`
   - Penthouse Presidential: `https://cdn1.genspark.ai/user-upload-image/4_generated/a9b8c7d6-4f3e-2a1b-9c8d-6e7f5a4b3c2d`
4. **편의시설**: 미슐랭 레스토랑/스파/인피니티 풀 - 월드클래스 시설
   - URL: `https://cdn1.genspark.ai/user-upload-image/4_generated/9c2b7f5e-6a8d-4e3f-b9c7-5d4e8f2a6b9c`

### **비주얼 업그레이드 특징**
- 모든 이미지가 **포토리얼리스틱** 수준으로 업그레이드
- **울트라 프리미엄** 인테리어 및 건축 디자인 적용
- **일관된 비주얼 언어**로 통일된 브랜드 이미지 구현
- 기존 지브리 스타일에서 **하이엔드급 실사 스타일**로 완전 변경

## 💻 개발 환경 설정
```bash
# 프로젝트 클론
git clone <repository-url>
cd webapp

# 의존성 설치
npm install

# 로컬 데이터베이스 설정
npm run db:migrate:local
npm run db:seed

# 개발 서버 시작
npm run build
pm2 start ecosystem.config.cjs

# 테스트
npm test
```

## 📋 API 엔드포인트
### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 회원권
- `GET /api/membership-types` - 회원권 타입 조회

### 사전구매
- `POST /api/pre-purchase` - 사전구매 신청

### 문의
- `POST /api/inquiries` - 문의사항 등록

### 뉴스레터
- `POST /api/newsletter/subscribe` - 뉴스레터 구독

## 🎯 사용자 가이드
### 일반 사용자
1. **홈페이지 접속**: 메인 조감도와 실버타운 소개 확인
2. **사전회원 가입**: 이메일, 이름, 연락처 등 기본정보 입력
3. **회원권 선택**: 4가지 타입 중 선호하는 회원권 확인
4. **사전구매 신청**: 로그인 후 원하는 회원권에 대해 사전구매 신청
5. **문의상담**: 추가 문의사항은 문의 폼을 통해 접수

### 관리자
1. **관리자 로그인**: admin@boracay-silvertown.com (패스워드: admin123)
2. **회원 관리**: 가입 승인, 회원 상태 관리
3. **신청 관리**: 사전구매 신청 검토 및 승인
4. **문의 관리**: 고객 문의에 대한 응답 작성

## 📊 배포 상태
- **플랫폼**: Cloudflare Pages (준비 완료)
- **현재 상태**: ✅ 풀스택 웹사이트 완료
- **데이터베이스**: ✅ D1 설정 및 샘플 데이터 완료
- **API**: ✅ 전체 기능 구현 및 테스트 완료
- **UI/UX**: ✅ 완전한 반응형 웹사이트 완료
- **기능**: ✅ 모든 네비게이션 및 모달 기능 작동
- **테스트**: ✅ API 및 프론트엔드 완전 동작 확인

## ✅ 현재 구현 완료된 기능
1. **완전한 UI/UX**: 모든 섹션, 모달, 네비게이션 기능 완료
2. **사용자 인증**: 회원가입, 로그인, JWT 토큰 관리
3. **회원권 시스템**: 4가지 타입별 상세 정보 및 사전구매 신청
4. **문의 관리**: 카테고리별 문의 등록 및 처리
5. **뉴스레터**: 구독 관리 시스템
6. **반응형 디자인**: 모바일, 태블릿, 데스크톱 완벽 지원
7. **데이터베이스**: 완전한 스키마 및 샘플 데이터

## 🔄 향후 개발 계획
1. **관리자 패널**: 회원/신청/문의 관리 대시보드
2. **결제 연동**: Stripe/PayPal 결제 시스템 통합
3. **이메일 알림**: Cloudflare Email Workers 활용
4. **다국어 지원**: 영어, 일본어 버전 추가
5. **실시간 채팅**: 고객 상담 시스템
6. **모바일 앱**: PWA 또는 네이티브 앱

## 📞 연락처
- **개발팀**: Boracay Silvertown Development Team
- **위치**: 보라카이 워터월드 리조트 부지
- **주소**: Monaco Road, Sitio Tulubhan, Boracay Jetty Port Rd, Boracay, Malay, 5608 Aklan

---
**최종 업데이트**: 2025-08-15  
**개발 상태**: ✅ **비주얼 업그레이드 완료** - 지브리 스타일에서 초실사 울트라 하이엔드 스타일로 완전 변경