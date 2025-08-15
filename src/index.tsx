import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings } from './types'
import { DatabaseService } from './utils/db'
import { hashPassword, verifyPassword, generateJWT, extractToken, requireAuth, requireAdmin } from './utils/auth'

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors({
  origin: ['*'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

// 로컬 개발 환경에서는 정적 파일 서빙을 wrangler에 위임

// 메인 페이지
app.get('/', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boracay Silvertown | 보라카이 실버타운</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap');
          
          .korean-font { font-family: 'Noto Sans KR', sans-serif; }
          .english-font { font-family: 'Playfair Display', serif; }
          
          .hero-bg {
            background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://cdn1.genspark.ai/user-upload-image/4_generated/d6f34b0f-92ed-4633-b816-50dacee5176a');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .gold-gradient {
            background: linear-gradient(135deg, #D4AF37, #FFD700, #B8860B);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .scroll-smooth {
            scroll-behavior: smooth;
          }
          
          .animate-fade-in {
            animation: fadeIn 1s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .floating {
            animation: floating 3s ease-in-out infinite;
          }
          
          @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        </style>
    </head>
    <body class="scroll-smooth">
        <!-- 네비게이션 -->
        <nav class="fixed top-0 w-full z-50 bg-black bg-opacity-80 backdrop-blur-md border-b border-gold-400">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-white english-font">
                            <span class="gold-gradient">Boracay</span> Silvertown
                        </h1>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-4">
                            <a href="#home" class="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium korean-font">홈</a>
                            <a href="#about" class="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium korean-font">소개</a>
                            <a href="#units" class="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium korean-font">유닛타입</a>
                            <a href="#facilities" class="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium korean-font">편의시설</a>
                            <a href="#contact" class="text-white hover:text-yellow-400 px-3 py-2 text-sm font-medium korean-font">문의</a>
                            <button onclick="showLoginModal()" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium korean-font transition-colors">로그인</button>
                        </div>
                    </div>
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-white hover:text-yellow-400">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- 히어로 섹션 -->
        <section id="home" class="hero-bg flex items-center justify-center">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
                <div class="glass-effect rounded-3xl p-12 max-w-4xl mx-auto">
                    <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 english-font">
                        <span class="gold-gradient">Luxury</span> Living<br>
                        <span class="korean-font text-3xl md:text-4xl">보라카이 프리미엄 실버타운</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-white mb-8 korean-font leading-relaxed">
                        한국의 전통미와 현대적 럭셔리가 만나는<br>
                        보라카이 최고급 시니어 리빙 커뮤니티
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onclick="showRegisterModal()" class="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white px-8 py-4 rounded-full text-lg font-semibold korean-font transition-all transform hover:scale-105 shadow-2xl">
                            <i class="fas fa-star mr-2"></i>사전 회원 등록
                        </button>
                        <button onclick="showInquiryModal()" class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold korean-font transition-all">
                            <i class="fas fa-phone mr-2"></i>상담 문의
                        </button>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- 소개 섹션 -->
        <section id="about" class="section-padding bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="section-title korean-font">
                        <span class="gold-gradient">보라카이</span> 실버타운 소개
                    </h2>
                    <p class="section-subtitle korean-font">
                        한국의 전통미와 현대적 럭셔리가 만나는 특별한 공간에서 
                        품격있는 시니어 라이프를 경험하세요.
                    </p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="animate-fade-in">
                        <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/514969fc-f37b-45a8-89a8-92790460a622" 
                             alt="한국 전통 로비" class="rounded-2xl shadow-2xl">
                    </div>
                    <div class="space-y-6">
                        <h3 class="text-3xl font-bold korean-font">한국의 아이덴티티가 살아있는 공간</h3>
                        <p class="text-lg text-gray-700 korean-font leading-relaxed">
                            보라카이 실버타운은 Monaco Road에 위치한 프리미엄 시니어 리빙 커뮤니티입니다. 
                            한국의 전통 궁궐 건축양식을 현대적으로 재해석하여 글로벌한 감각을 더했습니다.
                        </p>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <h4 class="text-2xl font-bold gold-gradient">4층</h4>
                                <p class="korean-font text-sm">웅장한 집합건물</p>
                            </div>
                            <div class="text-center p-4 bg-gray-50 rounded-lg">
                                <h4 class="text-2xl font-bold gold-gradient">럭셔리</h4>
                                <p class="korean-font text-sm">하이엔드 인테리어</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 유닛타입 섹션 -->
        <section id="units" class="section-padding bg-gray-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="section-title korean-font">회원권 유닛 타입</h2>
                    <p class="section-subtitle korean-font">
                        다양한 평수와 구성으로 준비된 4가지 프리미엄 유닛을 만나보세요.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <!-- Studio Premium -->
                    <div class="membership-card card-hover">
                        <div class="p-6">
                            <div class="text-center mb-4">
                                <h3 class="text-xl font-bold korean-font mb-2">스튜디오 프리미엄</h3>
                                <p class="text-gray-600 text-sm">Studio Premium</p>
                            </div>
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/30ef4aef-c900-46d4-83f0-237b9e5fb96f" 
                                 alt="스튜디오 프리미엄" class="w-full h-48 object-cover rounded-lg mb-4">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">면적</span>
                                    <span class="korean-font">45㎡ (13.6평)</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">가격</span>
                                    <span class="korean-font text-yellow-600 font-bold">1.5억원</span>
                                </div>
                                <p class="text-sm text-gray-600 korean-font">
                                    오션뷰 컴팩트 럭셔리 스튜디오, 스마트홈 시스템
                                </p>
                                <button onclick="applyPrePurchase(1)" class="w-full btn-primary korean-font">
                                    사전구매 신청
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- One Bedroom Deluxe -->
                    <div class="membership-card card-hover">
                        <div class="p-6">
                            <div class="text-center mb-4">
                                <h3 class="text-xl font-bold korean-font mb-2">원룸 디럭스</h3>
                                <p class="text-gray-600 text-sm">One Bedroom Deluxe</p>
                            </div>
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/30ef4aef-c900-46d4-83f0-237b9e5fb96f" 
                                 alt="원룸 디럭스" class="w-full h-48 object-cover rounded-lg mb-4">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">면적</span>
                                    <span class="korean-font">65㎡ (19.7평)</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">가격</span>
                                    <span class="korean-font text-yellow-600 font-bold">2.2억원</span>
                                </div>
                                <p class="text-sm text-gray-600 korean-font">
                                    별도 침실, 프리미엄 어메니티, 스터디룸
                                </p>
                                <button onclick="applyPrePurchase(2)" class="w-full btn-primary korean-font">
                                    사전구매 신청
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Two Bedroom Royal -->
                    <div class="membership-card card-hover featured">
                        <div class="p-6">
                            <div class="text-center mb-4">
                                <h3 class="text-xl font-bold korean-font mb-2">투룸 로열</h3>
                                <p class="text-gray-600 text-sm">Two Bedroom Royal</p>
                            </div>
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/1dbd0308-6f67-4b16-96cc-c7430a7a7ec1" 
                                 alt="투룸 로열" class="w-full h-48 object-cover rounded-lg mb-4">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">면적</span>
                                    <span class="korean-font">85㎡ (25.7평)</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">가격</span>
                                    <span class="korean-font text-yellow-600 font-bold">3.2억원</span>
                                </div>
                                <p class="text-sm text-gray-600 korean-font">
                                    파노라믹 오션뷰, 로열 스위트, 프라이빗 엘리베이터
                                </p>
                                <button onclick="applyPrePurchase(3)" class="w-full btn-primary korean-font">
                                    사전구매 신청
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Penthouse Presidential -->
                    <div class="membership-card card-hover">
                        <div class="p-6">
                            <div class="text-center mb-4">
                                <h3 class="text-xl font-bold korean-font mb-2">펜트하우스 프레지덴셜</h3>
                                <p class="text-gray-600 text-sm">Penthouse Presidential</p>
                            </div>
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/c6658e1d-2443-4062-86da-235b4f80cca9" 
                                 alt="펜트하우스 프레지덴셜" class="w-full h-48 object-cover rounded-lg mb-4">
                            <div class="space-y-3">
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">면적</span>
                                    <span class="korean-font">120㎡ (36.3평)</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="korean-font font-medium">가격</span>
                                    <span class="korean-font text-yellow-600 font-bold">5억원</span>
                                </div>
                                <p class="text-sm text-gray-600 korean-font">
                                    360도 오션뷰, 프라이빗 테라스, 헬기장 직접 접근
                                </p>
                                <button onclick="applyPrePurchase(4)" class="w-full btn-primary korean-font">
                                    사전구매 신청
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 편의시설 섹션 -->
        <section id="facilities" class="section-padding bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="section-title korean-font">프리미엄 편의시설</h2>
                    <p class="section-subtitle korean-font">
                        시니어 라이프를 풍요롭게 만들어 줄 다양한 편의시설을 제공합니다.
                    </p>
                </div>
                <div class="mb-12">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/2e27d37d-447e-4c28-ac84-c5cfd30f104a" 
                         alt="편의시설" class="w-full rounded-2xl shadow-2xl">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-swimming-pool"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">인피니티 풀</h3>
                        <p class="text-sm text-gray-600 korean-font">바다를 내려다보는 럭셔리 인피니티 풀</p>
                    </div>
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-spa"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">스파 & 웰니스</h3>
                        <p class="text-sm text-gray-600 korean-font">전통 한국식 트리트먼트 제공</p>
                    </div>
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-anchor"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">프라이빗 마리나</h3>
                        <p class="text-sm text-gray-600 korean-font">요트 서비스 제공 전용 마리나</p>
                    </div>
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-helicopter"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">헬리패드</h3>
                        <p class="text-sm text-gray-600 korean-font">편리한 교통을 위한 프라이빗 헬리패드</p>
                    </div>
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-utensils"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">파인 다이닝</h3>
                        <p class="text-sm text-gray-600 korean-font">미슐랭 수준의 레스토랑</p>
                    </div>
                    <div class="facility-card text-center p-6">
                        <div class="facility-icon">
                            <i class="fas fa-dumbbell"></i>
                        </div>
                        <h3 class="text-lg font-bold korean-font mb-2">피트니스 센터</h3>
                        <p class="text-sm text-gray-600 korean-font">개인 트레이너와 함께하는 피트니스</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 문의 섹션 -->
        <section id="contact" class="section-padding bg-gray-900 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="section-title text-white korean-font">문의하기</h2>
                    <p class="section-subtitle text-gray-300 korean-font">
                        보라카이 실버타운에 대한 궁금한 점이 있으시면 언제든 문의해주세요.
                    </p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-2xl font-bold korean-font mb-6">연락처 정보</h3>
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <i class="fas fa-map-marker-alt text-yellow-400 text-xl w-8"></i>
                                <span class="korean-font">Monaco Road, Sitio Tulubhan, Boracay, Malay, 5608 Aklan</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-envelope text-yellow-400 text-xl w-8"></i>
                                <span class="korean-font">info@boracay-silvertown.com</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-phone text-yellow-400 text-xl w-8"></i>
                                <span class="korean-font">+63-XX-XXXX-XXXX</span>
                            </div>
                        </div>
                        <div class="mt-8">
                            <button onclick="showInquiryModal()" class="btn-primary korean-font">
                                <i class="fas fa-paper-plane mr-2"></i>문의하기
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold korean-font mb-6">뉴스레터 구독</h3>
                        <p class="text-gray-300 korean-font mb-6">
                            실버타운 개발 소식과 특별한 혜택을 가장 먼저 받아보세요.
                        </p>
                        <form id="newsletterForm" class="space-y-4">
                            <input type="email" name="email" placeholder="이메일 주소" 
                                   class="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none">
                            <input type="text" name="name" placeholder="성함" 
                                   class="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-yellow-400 focus:outline-none">
                            <button type="submit" class="w-full btn-primary korean-font">
                                구독하기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- 모달들 -->
        <!-- 로그인 모달 -->
        <div id="loginModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold korean-font">로그인</h2>
                    <button onclick="hideLoginModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="loginForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">이메일</label>
                        <input type="email" name="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">비밀번호</label>
                        <input type="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <button type="submit" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg korean-font">
                        로그인
                    </button>
                </form>
                <p class="text-center text-gray-600 text-sm mt-4 korean-font">
                    계정이 없으신가요? <button onclick="hideLoginModal(); showRegisterModal();" class="text-yellow-600 hover:underline">회원가입</button>
                </p>
            </div>
        </div>

        <!-- 회원가입 모달 -->
        <div id="registerModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full max-h-90vh overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold korean-font">회원가입</h2>
                    <button onclick="hideRegisterModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="registerForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">이메일</label>
                        <input type="email" name="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">성명</label>
                        <input type="text" name="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">연락처</label>
                        <input type="tel" name="phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">생년월일</label>
                        <input type="date" name="birth_date" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">비밀번호</label>
                        <input type="password" name="password" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">비밀번호 확인</label>
                        <input type="password" name="confirmPassword" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <button type="submit" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg korean-font">
                        회원가입
                    </button>
                </form>
                <p class="text-center text-gray-600 text-sm mt-4 korean-font">
                    이미 계정이 있으신가요? <button onclick="hideRegisterModal(); showLoginModal();" class="text-yellow-600 hover:underline">로그인</button>
                </p>
            </div>
        </div>

        <!-- 문의 모달 -->
        <div id="inquiryModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-8 max-w-md w-full max-h-90vh overflow-y-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold korean-font">문의하기</h2>
                    <button onclick="hideInquiryModal()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="inquiryForm">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">성명</label>
                        <input type="text" name="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">이메일</label>
                        <input type="email" name="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">연락처</label>
                        <input type="tel" name="phone" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">문의 분류</label>
                        <select name="category" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500">
                            <option value="general">일반 문의</option>
                            <option value="membership">회원권 문의</option>
                            <option value="facilities">시설 문의</option>
                            <option value="investment">투자 문의</option>
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">제목</label>
                        <input type="text" name="subject" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2 korean-font">문의내용</label>
                        <textarea name="message" rows="4" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-yellow-500" required></textarea>
                    </div>
                    <button type="submit" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg korean-font">
                        문의하기
                    </button>
                </form>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API 라우트들

// 회원 등록
app.post('/api/auth/register', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const { email, password, name, phone, birth_date, nationality, preferred_language } = await c.req.json()
    
    // 이메일 중복 확인
    const existingMember = await db.getMemberByEmail(email)
    if (existingMember) {
      return c.json({ error: '이미 등록된 이메일입니다.' }, 400)
    }
    
    // 비밀번호 해시화
    const password_hash = await hashPassword(password)
    
    // 회원 생성
    const member = await db.createMember({
      email,
      password_hash,
      name,
      phone,
      birth_date,
      nationality: nationality || 'KR',
      preferred_language: preferred_language || 'ko'
    })
    
    if (!member) {
      return c.json({ error: '회원 등록에 실패했습니다.' }, 500)
    }
    
    // 활동 로그 기록
    await db.createActivityLog({
      member_id: member.id,
      action: 'register',
      description: '회원 가입',
      ip_address: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
      user_agent: c.req.header('User-Agent')
    })
    
    // JWT 토큰 생성
    const token = await generateJWT({
      id: member.id!,
      email: member.email,
      role: member.role || 'member'
    })
    
    return c.json({
      success: true,
      message: '회원가입이 완료되었습니다.',
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
        status: member.status
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

// 로그인
app.post('/api/auth/login', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const { email, password } = await c.req.json()
    
    // 회원 조회
    const member = await db.getMemberByEmail(email)
    if (!member) {
      return c.json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' }, 401)
    }
    
    // 비밀번호 확인
    const isValidPassword = await verifyPassword(password, member.password_hash!)
    if (!isValidPassword) {
      return c.json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' }, 401)
    }
    
    // 로그인 시간 업데이트
    await db.updateLastLogin(member.id!)
    
    // 활동 로그 기록
    await db.createActivityLog({
      member_id: member.id,
      action: 'login',
      description: '로그인',
      ip_address: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
      user_agent: c.req.header('User-Agent')
    })
    
    // JWT 토큰 생성
    const token = await generateJWT({
      id: member.id!,
      email: member.email,
      role: member.role || 'member'
    })
    
    return c.json({
      success: true,
      message: '로그인이 완료되었습니다.',
      token,
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        role: member.role,
        status: member.status
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

// 회원권 타입 조회
app.get('/api/membership-types', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const membershipTypes = await db.getAllMembershipTypes()
    return c.json({ membershipTypes })
  } catch (error) {
    console.error('Error getting membership types:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

// 사전구매 신청
app.post('/api/pre-purchase', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const token = extractToken(c.req.header('Authorization'))
    const user = await requireAuth(token)
    
    if (!user) {
      return c.json({ error: '로그인이 필요합니다.' }, 401)
    }
    
    const { membership_type_id, preferred_floor, preferred_orientation, payment_method, deposit_amount } = await c.req.json()
    
    // 회원권 타입 확인
    const membershipType = await db.getMembershipTypeById(membership_type_id)
    if (!membershipType) {
      return c.json({ error: '유효하지 않은 회원권 타입입니다.' }, 400)
    }
    
    // 사전구매 신청 생성
    const application = await db.createPrePurchaseApplication({
      member_id: user.id,
      membership_type_id,
      preferred_floor,
      preferred_orientation,
      payment_method,
      deposit_amount: deposit_amount || 0,
      total_amount: membershipType.price
    })
    
    if (!application) {
      return c.json({ error: '신청 처리에 실패했습니다.' }, 500)
    }
    
    // 활동 로그 기록
    await db.createActivityLog({
      member_id: user.id,
      action: 'pre_purchase_application',
      description: `회원권 사전구매 신청 - ${membershipType.name_ko}`,
      ip_address: c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For'),
      user_agent: c.req.header('User-Agent')
    })
    
    return c.json({
      success: true,
      message: '사전구매 신청이 완료되었습니다.',
      application
    })
  } catch (error) {
    console.error('Pre-purchase application error:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

// 문의사항 등록
app.post('/api/inquiries', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const { name, email, phone, subject, message, category } = await c.req.json()
    
    const token = extractToken(c.req.header('Authorization'))
    const user = await requireAuth(token)
    
    const inquiry = await db.createInquiry({
      member_id: user?.id,
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'general'
    })
    
    if (!inquiry) {
      return c.json({ error: '문의 등록에 실패했습니다.' }, 500)
    }
    
    return c.json({
      success: true,
      message: '문의사항이 등록되었습니다.',
      inquiry
    })
  } catch (error) {
    console.error('Inquiry creation error:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

// 뉴스레터 구독
app.post('/api/newsletter/subscribe', async (c) => {
  try {
    const db = new DatabaseService(c.env.DB)
    const { email, name, language } = await c.req.json()
    
    const success = await db.subscribeNewsletter(email, name, language)
    
    if (!success) {
      return c.json({ error: '구독 처리에 실패했습니다.' }, 500)
    }
    
    return c.json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다.'
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return c.json({ error: '서버 오류가 발생했습니다.' }, 500)
  }
})

export default app
