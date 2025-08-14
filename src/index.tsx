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

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }))

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
