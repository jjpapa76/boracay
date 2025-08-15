import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings } from './types'
import { DatabaseService } from './utils/db'
import { hashPassword, verifyPassword, generateJWT, extractToken, requireAuth, requireAdmin } from './utils/auth'

const app = new Hono<{ Bindings: Bindings }>()

// 유닛별 모달 생성 함수
function generateUnitModals() {
  return `
    <!-- Studio Premium Modal -->
    <div id="studio-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Studio Premium</h2>
                    <p class="korean-font text-gray-300">45㎡ (13.6평) | 1.5억원</p>
                </div>
                <button onclick="closeModal('studio-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="unit-gallery">
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/3288ae9a-13e7-48f7-ab58-8ae6365df62c', 'Studio Premium - 오션뷰 리빙')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/3288ae9a-13e7-48f7-ab58-8ae6365df62c" alt="Studio Ocean View">
                    <div class="gallery-caption">
                        <strong>오션뷰 리빙</strong><br>
                        파노라믹 바다 전망의 럭셔리 스튜디오
                    </div>
                </div>
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/1fb41c22-7522-43b7-9eea-59084e2e7dd4', 'Studio Premium - 베드룸 앵글')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/1fb41c22-7522-43b7-9eea-59084e2e7dd4" alt="Studio Bedroom">
                    <div class="gallery-caption">
                        <strong>베드룸 앵글</strong><br>
                        프리미엄 침실 공간과 바다 전망
                    </div>
                </div>
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/23256e8d-a449-4359-b918-5cc8affff15f', 'Studio Premium - 럭셔리 욕실')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/23256e8d-a449-4359-b918-5cc8affff15f" alt="Studio Bathroom">
                    <div class="gallery-caption">
                        <strong>럭셔리 욕실</strong><br>
                        오션뷰 욕조와 프리미엄 마블 마감
                    </div>
                </div>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 컴팩트하지만 럭셔리한 스튜디오 공간</li>
                    <li>• 전면 오션뷰 대형 창문</li>
                    <li>• 프리미엄 인테리어와 빌트인 가구</li>
                    <li>• 한국 전통 디자인 요소 적용</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- One Bedroom Modal -->
    <div id="onebedroom-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">One Bedroom Deluxe</h2>
                    <p class="korean-font text-gray-300">65㎡ (19.7평) | 2.2억원</p>
                </div>
                <button onclick="closeModal('onebedroom-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="unit-gallery">
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/264c7e3e-d6aa-49e7-afcd-48692d387074', 'One Bedroom Deluxe - 오션뷰 리빙')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/264c7e3e-d6aa-49e7-afcd-48692d387074" alt="One Bedroom Ocean View">
                    <div class="gallery-caption">
                        <strong>오션뷰 리빙</strong><br>
                        파노라믹 바다 전망의 거실 공간
                    </div>
                </div>
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/42b434dd-3f01-401b-9275-4df4396e7669', 'One Bedroom Deluxe - 마스터 베드룸')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/42b434dd-3f01-401b-9275-4df4396e7669" alt="One Bedroom Master Bedroom">
                    <div class="gallery-caption">
                        <strong>마스터 베드룸</strong><br>
                        럭셔리 킹 베드와 선셋 오션뷰
                    </div>
                </div>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 분리된 침실과 넓은 거실 공간</li>
                    <li>• 파노라믹 오션뷰</li>
                    <li>• 프리미엄 어메니티 완비</li>
                    <li>• 현대적 한국 디자인 감성</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Two Bedroom Modal -->
    <div id="twobedroom-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Two Bedroom Royal</h2>
                    <p class="korean-font text-gray-300">85㎡ (25.7평) | 3.2억원</p>
                </div>
                <button onclick="closeModal('twobedroom-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="unit-gallery">
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/6410d897-1554-4b29-8141-d0b047ae1afe', 'Two Bedroom Royal - 오션뷰 리빙')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/6410d897-1554-4b29-8141-d0b047ae1afe" alt="Two Bedroom Ocean View">
                    <div class="gallery-caption">
                        <strong>오션뷰 리빙</strong><br>
                        로열 스위트 레벨의 거실 공간
                    </div>
                </div>
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/37a887ae-2e19-4e8e-8cfd-6a9926d27b4e', 'Two Bedroom Royal - 로열 마스터룸')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/37a887ae-2e19-4e8e-8cfd-6a9926d27b4e" alt="Two Bedroom Royal Master">
                    <div class="gallery-caption">
                        <strong>로열 마스터룸</strong><br>
                        한국 궁궐 스타일 헤드보드와 발코니
                    </div>
                </div>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 투룸 로열 스위트 구조</li>
                    <li>• 파노라믹 오션뷰와 황금시간 조명</li>
                    <li>• 한국 궁궐 스타일 디자인 요소</li>
                    <li>• 프리미엄 마블과 골드 액센트</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Penthouse Modal -->
    <div id="penthouse-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Penthouse Presidential</h2>
                    <p class="korean-font text-gray-300">120㎡ (36.3평) | 5억원</p>
                </div>
                <button onclick="closeModal('penthouse-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="unit-gallery">
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/4225d7a6-ae92-4111-9a37-116cada7e42c', 'Penthouse Presidential - 360도 오션뷰')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/4225d7a6-ae92-4111-9a37-116cada7e42c" alt="Penthouse Ocean View">
                    <div class="gallery-caption">
                        <strong>360도 오션뷰</strong><br>
                        최고급 펜트하우스 프레지덴셜 스위트
                    </div>
                </div>
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/81fa3a99-f937-4e2e-a9fc-24235d5d50f0', 'Penthouse Presidential - 프라이빗 테라스')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/81fa3a99-f937-4e2e-a9fc-24235d5d50f0" alt="Penthouse Terrace">
                    <div class="gallery-caption">
                        <strong>프라이빗 테라스</strong><br>
                        360도 파노라믹뷰와 야외 다이닝
                    </div>
                </div>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 360도 파노라믹 오션뷰</li>
                    <li>• 프라이빗 테라스와 헬리패드 직접 접근</li>
                    <li>• 프레지덴셜 스위트 레벨 럭셔리</li>
                    <li>• 한국 궁궐 디자인의 최고급 버전</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Helipad Modal -->
    <div id="helipad-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Private Helipad</h2>
                    <p class="korean-font text-gray-300">프라이빗 헬리패드</p>
                </div>
                <button onclick="closeModal('helipad-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 건물 최상층 프라이빗 헬리패드</li>
                    <li>• 펜트하우스 거주자 전용 접근</li>
                    <li>• 24시간 운항 서비스</li>
                    <li>• 마닐라/세부 직항 연결</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Marina Modal -->
    <div id="marina-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Private Marina</h2>
                    <p class="korean-font text-gray-300">프라이빗 유럽형 마리나</p>
                </div>
                <button onclick="closeModal('marina-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 유럽형 프라이빗 선착장</li>
                    <li>• 대형 요트 및 크루저 계류 가능</li>
                    <li>• 24시간 보안 및 관리 서비스</li>
                    <li>• 보라카이 해안 직접 접근</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Lobby Modal -->
    <div id="lobby-modal" class="unit-modal">
        <div class="modal-content">
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h2 class="english-font text-3xl font-bold text-yellow-400 mb-2">Grand Lobby</h2>
                    <p class="korean-font text-gray-300">한국 궁궐 스타일 그랜드 로비</p>
                </div>
                <button onclick="closeModal('lobby-modal')" class="text-white hover:text-yellow-400 text-3xl">&times;</button>
            </div>
            <div class="unit-gallery">
                <div class="gallery-item" onclick="expandImage('https://cdn1.genspark.ai/user-upload-image/4_generated/6e7eaa7b-c1ec-4c5c-b5e9-b4b94a26d7e6', 'Grand Lobby - 한국 궁궐 스타일')">
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/6e7eaa7b-c1ec-4c5c-b5e9-b4b94a26d7e6" alt="Grand Lobby">
                    <div class="gallery-caption">
                        <strong>그랜드 로비</strong><br>
                        포시즌스급 한국 궁궐 스타일 로비
                    </div>
                </div>
            </div>
            <div class="mt-6 text-gray-300 korean-font">
                <h4 class="text-lg font-semibold text-yellow-400 mb-3">특징</h4>
                <ul class="space-y-2">
                    <li>• 한국 전통 궁궐 건축 양식</li>
                    <li>• 프리미엄 마블과 골드 액센트</li>
                    <li>• 크리스탈 샹들리에와 고급 인테리어</li>
                    <li>• 24시간 컨시어지 서비스</li>
                </ul>
            </div>
        </div>
    </div>
  `;
}

// CORS 설정
app.use('/api/*', cors({
  origin: ['*'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

// 로컬 개발 환경에서는 정적 파일 서빙을 wrangler에 위임

// 3D 투시도 페이지
app.get('/perspective', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>3D 투시도 | Boracay Silvertown</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap');
          
          .korean-font { font-family: 'Noto Sans KR', sans-serif; }
          .english-font { font-family: 'Playfair Display', serif; }
          
          .perspective-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: #000;
          }
          
          .aerial-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .hotspot {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.9);
            border: 3px solid rgba(255, 255, 255, 0.8);
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            animation: pulse 2s infinite;
          }
          
          .hotspot:hover {
            transform: scale(1.2);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
          }
          
          .hotspot i {
            color: white;
            font-size: 16px;
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
            50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.9); }
            100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
          }
          
          .unit-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
          }
          
          .modal-content {
            background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
            border-radius: 20px;
            padding: 30px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 215, 0, 0.3);
          }
          
          .unit-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          
          .gallery-item {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          
          .gallery-item:hover {
            transform: scale(1.05);
          }
          
          .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
          }
          
          .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 15px;
            font-size: 14px;
          }
          
          .nav-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
            display: flex;
            gap: 10px;
          }
          
          .nav-btn {
            background: rgba(0, 0, 0, 0.7);
            border: 1px solid rgba(255, 215, 0, 0.5);
            color: white;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .nav-btn:hover {
            background: rgba(255, 215, 0, 0.2);
            border-color: rgba(255, 215, 0, 0.8);
          }
          
          .info-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 20px;
            border-radius: 15px;
            color: white;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 215, 0, 0.3);
            max-width: 300px;
          }
        </style>
    </head>
    <body class="bg-black">
        <div class="perspective-container">
            <!-- 야경 조감도 -->
            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/39217760-90e6-45bd-9db2-21e12cbb0835" 
                 alt="Boracay Silvertown Night View" class="aerial-image">
            
            <!-- 핫스팟들 -->
            <!-- 헬리패드 -->
            <div class="hotspot" style="top: 15%; left: 45%;" data-hotspot="helipad">
                <i class="fas fa-helicopter"></i>
            </div>
            
            <!-- Studio Premium (2층) -->
            <div class="hotspot" style="top: 40%; left: 35%;" data-hotspot="studio">
                <i class="fas fa-bed"></i>
            </div>
            
            <!-- One Bedroom (3층) -->
            <div class="hotspot" style="top: 35%; left: 50%;" data-hotspot="onebedroom">
                <i class="fas fa-home"></i>
            </div>
            
            <!-- Two Bedroom (3층) -->
            <div class="hotspot" style="top: 35%; left: 65%;" data-hotspot="twobedroom">
                <i class="fas fa-building"></i>
            </div>
            
            <!-- Penthouse (4층) -->
            <div class="hotspot" style="top: 25%; left: 55%;" data-hotspot="penthouse">
                <i class="fas fa-crown"></i>
            </div>
            
            <!-- 마리나 -->
            <div class="hotspot" style="top: 75%; left: 30%;" data-hotspot="marina">
                <i class="fas fa-anchor"></i>
            </div>
            
            <!-- 로비 -->
            <div class="hotspot" style="top: 50%; left: 45%;" data-hotspot="lobby">
                <i class="fas fa-door-open"></i>
            </div>
        </div>
        
        <!-- 내비게이션 컨트롤 -->
        <div class="nav-controls">
            <button class="nav-btn" onclick="goHome()">
                <i class="fas fa-home"></i> 홈으로
            </button>
            <button class="nav-btn" onclick="toggleFullscreen()">
                <i class="fas fa-expand"></i> 전체화면
            </button>
        </div>
        
        <!-- 정보 패널 -->
        <div class="info-panel">
            <h3 class="english-font text-lg font-bold text-yellow-400 mb-2">Interactive 3D View</h3>
            <p class="korean-font text-sm mb-2">황금색 포인트를 클릭하여 각 시설의 상세 투시도를 확인하세요.</p>
            <div class="text-xs text-gray-300">
                <i class="fas fa-mouse-pointer"></i> 클릭으로 탐험
            </div>
        </div>
        
        <!-- 모달들 -->
        ${generateUnitModals()}
        
        <script>
            // 핫스팟 클릭 이벤트
            document.querySelectorAll('.hotspot').forEach(hotspot => {
                hotspot.addEventListener('click', function() {
                    const type = this.dataset.hotspot;
                    showModal(type);
                });
            });
            
            // 모달 표시 함수
            function showModal(type) {
                const modal = document.getElementById(type + '-modal');
                if (modal) {
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }
            
            // 모달 닫기 함수
            function closeModal(modalId) {
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }
            
            // ESC 키로 모달 닫기
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.unit-modal').forEach(modal => {
                        modal.style.display = 'none';
                    });
                    document.body.style.overflow = 'auto';
                }
            });
            
            // 홈으로 이동
            function goHome() {
                window.location.href = '/';
            }
            
            // 전체화면 토글
            function toggleFullscreen() {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
            
            // 갤러리 이미지 클릭 시 확대
            function expandImage(src, title) {
                const expandModal = document.createElement('div');
                expandModal.className = 'unit-modal';
                expandModal.style.display = 'flex';
                expandModal.innerHTML = \`
                    <div class="modal-content" style="max-width: 95vw; max-height: 95vh; padding: 10px;">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="english-font text-xl font-bold text-yellow-400">\${title}</h3>
                            <button onclick="this.closest('.unit-modal').remove(); document.body.style.overflow='auto';" 
                                    class="text-white hover:text-yellow-400 text-2xl">&times;</button>
                        </div>
                        <img src="\${src}" alt="\${title}" style="width: 100%; height: auto; border-radius: 10px;">
                    </div>
                \`;
                document.body.appendChild(expandModal);
                document.body.style.overflow = 'hidden';
            }
        </script>
    </body>
    </html>
  `)
})

// 관리자 대시보드
app.get('/admin', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);

  // 통계 데이터 조회
  const stats = await Promise.all([
    db.execute('SELECT COUNT(*) as count FROM members', []),
    db.execute('SELECT COUNT(*) as count FROM pre_purchase_applications', []),
    db.execute('SELECT COUNT(*) as count FROM inquiries WHERE status = ?', ['pending']),
    db.execute('SELECT COUNT(*) as count FROM newsletter_subscriptions', [])
  ]);

  const memberCount = stats[0].results[0].count;
  const applicationCount = stats[1].results[0].count;
  const pendingInquiries = stats[2].results[0].count;
  const newsletterCount = stats[3].results[0].count;

  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>관리자 패널 | Boracay Silvertown</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap');
          
          .korean-font { font-family: 'Noto Sans KR', sans-serif; }
          .english-font { font-family: 'Playfair Display', serif; }
          
          .admin-sidebar {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-right: 1px solid rgba(255, 215, 0, 0.2);
          }
          
          .admin-content {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            min-height: 100vh;
          }
          
          .stat-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border-left: 5px solid;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          }
          
          .stat-card.members { border-left-color: #3b82f6; }
          .stat-card.applications { border-left-color: #10b981; }
          .stat-card.inquiries { border-left-color: #f59e0b; }
          .stat-card.newsletter { border-left-color: #8b5cf6; }
          
          .nav-item {
            padding: 15px 20px;
            margin: 5px 15px;
            border-radius: 10px;
            color: white;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .nav-item:hover, .nav-item.active {
            background: rgba(255, 215, 0, 0.2);
            color: #ffd700;
            transform: translateX(5px);
          }
          
          .data-table {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .table-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
          }
          
          .action-btn {
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          
          .btn-approve { background: #10b981; color: white; }
          .btn-approve:hover { background: #059669; transform: scale(1.05); }
          
          .btn-reject { background: #ef4444; color: white; }
          .btn-reject:hover { background: #dc2626; transform: scale(1.05); }
          
          .btn-view { background: #3b82f6; color: white; }
          .btn-view:hover { background: #2563eb; transform: scale(1.05); }
        </style>
    </head>
    <body class="bg-gray-100">
        <div class="flex h-screen">
            <!-- 사이드바 -->
            <div class="admin-sidebar w-64 flex-shrink-0">
                <div class="p-6 border-b border-yellow-400 border-opacity-30">
                    <h2 class="text-2xl font-bold text-white english-font">
                        <span class="gold-gradient">ADMIN</span><br>
                        <span class="text-sm korean-font text-yellow-400">관리자 패널</span>
                    </h2>
                </div>
                <nav class="mt-6">
                    <div class="nav-item active" onclick="showSection('dashboard')">
                        <i class="fas fa-chart-pie mr-3"></i>
                        <span class="korean-font">대시보드</span>
                    </div>
                    <div class="nav-item" onclick="showSection('members')">
                        <i class="fas fa-users mr-3"></i>
                        <span class="korean-font">회원 관리</span>
                    </div>
                    <div class="nav-item" onclick="showSection('applications')">
                        <i class="fas fa-file-contract mr-3"></i>
                        <span class="korean-font">사전구매 신청</span>
                    </div>
                    <div class="nav-item" onclick="showSection('inquiries')">
                        <i class="fas fa-question-circle mr-3"></i>
                        <span class="korean-font">문의사항</span>
                    </div>
                    <div class="nav-item" onclick="showSection('newsletter')">
                        <i class="fas fa-envelope mr-3"></i>
                        <span class="korean-font">뉴스레터</span>
                    </div>
                    <div class="nav-item mt-10" onclick="window.location.href='/'">
                        <i class="fas fa-home mr-3"></i>
                        <span class="korean-font">홈페이지</span>
                    </div>
                    <div class="nav-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt mr-3"></i>
                        <span class="korean-font">로그아웃</span>
                    </div>
                </nav>
            </div>

            <!-- 메인 컨텐츠 -->
            <div class="admin-content flex-1 overflow-auto">
                <!-- 대시보드 섹션 -->
                <div id="dashboard-section" class="section">
                    <div class="p-8">
                        <div class="mb-8">
                            <h1 class="text-3xl font-bold korean-font text-gray-800 mb-2">관리자 대시보드</h1>
                            <p class="text-gray-600 korean-font">보라카이 실버타운 관리 현황</p>
                        </div>

                        <!-- 통계 카드 -->
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div class="stat-card members">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600 korean-font">총 회원수</p>
                                        <p class="text-3xl font-bold text-blue-600">${memberCount}</p>
                                    </div>
                                    <i class="fas fa-users text-4xl text-blue-300"></i>
                                </div>
                                <p class="text-xs text-gray-500 korean-font mt-2">등록된 사전회원</p>
                            </div>

                            <div class="stat-card applications">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600 korean-font">사전구매 신청</p>
                                        <p class="text-3xl font-bold text-green-600">${applicationCount}</p>
                                    </div>
                                    <i class="fas fa-file-contract text-4xl text-green-300"></i>
                                </div>
                                <p class="text-xs text-gray-500 korean-font mt-2">접수된 신청서</p>
                            </div>

                            <div class="stat-card inquiries">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600 korean-font">대기 문의</p>
                                        <p class="text-3xl font-bold text-yellow-600">${pendingInquiries}</p>
                                    </div>
                                    <i class="fas fa-question-circle text-4xl text-yellow-300"></i>
                                </div>
                                <p class="text-xs text-gray-500 korean-font mt-2">답변 대기중</p>
                            </div>

                            <div class="stat-card newsletter">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-sm font-medium text-gray-600 korean-font">뉴스레터 구독</p>
                                        <p class="text-3xl font-bold text-purple-600">${newsletterCount}</p>
                                    </div>
                                    <i class="fas fa-envelope text-4xl text-purple-300"></i>
                                </div>
                                <p class="text-xs text-gray-500 korean-font mt-2">구독자 수</p>
                            </div>
                        </div>

                        <!-- 차트 영역 -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div class="data-table">
                                <div class="table-header">
                                    <h3 class="text-xl font-bold korean-font">회원 가입 추이</h3>
                                </div>
                                <div class="p-6">
                                    <canvas id="memberChart" width="400" height="200"></canvas>
                                </div>
                            </div>

                            <div class="data-table">
                                <div class="table-header">
                                    <h3 class="text-xl font-bold korean-font">유닛별 신청 현황</h3>
                                </div>
                                <div class="p-6">
                                    <canvas id="unitChart" width="400" height="200"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 회원 관리 섹션 -->
                <div id="members-section" class="section hidden">
                    <div class="p-8">
                        <div class="mb-6">
                            <h1 class="text-3xl font-bold korean-font text-gray-800">회원 관리</h1>
                        </div>
                        <div id="members-table" class="data-table">
                            <div class="table-header">
                                <h3 class="text-xl font-bold korean-font">등록 회원 목록</h3>
                            </div>
                            <div class="p-4">
                                <div class="overflow-x-auto">
                                    <table class="min-w-full">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-font">이름</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-font">이메일</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-font">가입일</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-font">상태</th>
                                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-font">관리</th>
                                            </tr>
                                        </thead>
                                        <tbody id="members-tbody" class="bg-white divide-y divide-gray-200">
                                            <!-- 동적으로 로드 -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 다른 섹션들도 비슷하게 구현 -->
                <div id="applications-section" class="section hidden">
                    <div class="p-8">
                        <h1 class="text-3xl font-bold korean-font text-gray-800">사전구매 신청 관리</h1>
                        <div id="applications-content">
                            <!-- 사전구매 신청 관리 내용 -->
                        </div>
                    </div>
                </div>

                <div id="inquiries-section" class="section hidden">
                    <div class="p-8">
                        <h1 class="text-3xl font-bold korean-font text-gray-800">문의사항 관리</h1>
                        <div id="inquiries-content">
                            <!-- 문의사항 관리 내용 -->
                        </div>
                    </div>
                </div>

                <div id="newsletter-section" class="section hidden">
                    <div class="p-8">
                        <h1 class="text-3xl font-bold korean-font text-gray-800">뉴스레터 관리</h1>
                        <div id="newsletter-content">
                            <!-- 뉴스레터 관리 내용 -->
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            // 섹션 전환 함수
            function showSection(sectionName) {
                // 모든 섹션 숨기기
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.add('hidden');
                });
                
                // 모든 네비게이션 아이템에서 active 제거
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // 선택된 섹션 보이기
                document.getElementById(sectionName + '-section').classList.remove('hidden');
                
                // 선택된 네비게이션 아이템에 active 추가
                event.target.classList.add('active');
                
                // 섹션별 데이터 로드
                if (sectionName === 'members') {
                    loadMembers();
                } else if (sectionName === 'dashboard') {
                    initCharts();
                }
            }

            // 차트 초기화
            function initCharts() {
                // 회원 가입 추이 차트
                const memberCtx = document.getElementById('memberChart');
                if (memberCtx) {
                    new Chart(memberCtx, {
                        type: 'line',
                        data: {
                            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                            datasets: [{
                                label: '신규 회원',
                                data: [5, 12, 8, 15, 22, 18],
                                borderColor: '#3b82f6',
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '월별 신규 회원 가입'
                                }
                            }
                        }
                    });
                }

                // 유닛별 신청 현황 차트
                const unitCtx = document.getElementById('unitChart');
                if (unitCtx) {
                    new Chart(unitCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Studio Premium', 'One Bedroom', 'Two Bedroom', 'Penthouse'],
                            datasets: [{
                                data: [30, 45, 20, 5],
                                backgroundColor: [
                                    '#3b82f6',
                                    '#10b981',
                                    '#f59e0b',
                                    '#8b5cf6'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                title: {
                                    display: true,
                                    text: '유닛별 사전구매 신청'
                                }
                            }
                        }
                    });
                }
            }

            // 회원 목록 로드
            async function loadMembers() {
                try {
                    const response = await fetch('/api/admin/members', {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    const data = await response.json();
                    
                    const tbody = document.getElementById('members-tbody');
                    tbody.innerHTML = data.members.map(member => \`
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">\${member.name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${member.email}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${new Date(member.created_at).toLocaleDateString()}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">활성</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button class="action-btn btn-view" onclick="viewMember(\${member.id})">상세</button>
                                <button class="action-btn btn-reject" onclick="deleteMember(\${member.id})">삭제</button>
                            </td>
                        </tr>
                    \`).join('');
                } catch (error) {
                    console.error('회원 목록 로드 실패:', error);
                }
            }

            // 로그아웃
            function logout() {
                localStorage.removeItem('token');
                window.location.href = '/';
            }

            // 페이지 로드 시 차트 초기화
            document.addEventListener('DOMContentLoaded', function() {
                initCharts();
            });
        </script>
    </body>
    </html>
  `)
})

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
            background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://cdn1.genspark.ai/user-upload-image/4_generated/2d32bd92-8f18-44bf-bfcb-58112f7196cb');
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
            background: linear-gradient(135deg, #C9A96E, #F4E4BC, #8B7B3A, #D4AF37);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
          }
          
          .premium-gradient {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 25%, #1a1a1a 50%, #000000 100%);
          }
          
          .luxury-shadow {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
          
          .ultra-glass {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
        <nav class="fixed top-0 w-full z-50 premium-gradient bg-opacity-95 backdrop-blur-lg border-b border-yellow-400 border-opacity-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <div class="flex items-center">
                        <h1 class="text-2xl font-bold text-white english-font tracking-wide">
                            <span class="gold-gradient">BORACAY</span>
                            <span class="text-yellow-400 text-sm font-light ml-2">SILVERTOWN</span>
                        </h1>
                    </div>
                    <div class="hidden md:block">
                        <div class="ml-10 flex items-baseline space-x-6">
                            <a href="#home" class="text-white hover:text-yellow-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-yellow-400">홈</a>
                            <a href="/perspective" class="text-white hover:text-blue-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-blue-400">3D 투시도</a>
                            <a href="#about" class="text-white hover:text-yellow-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-yellow-400">소개</a>
                            <a href="#units" class="text-white hover:text-yellow-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-yellow-400">유닛타입</a>
                            <a href="#facilities" class="text-white hover:text-yellow-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-yellow-400">편의시설</a>
                            <a href="#contact" class="text-white hover:text-yellow-400 px-4 py-2 text-sm font-semibold korean-font transition-all duration-300 border-b-2 border-transparent hover:border-yellow-400">문의</a>
                            <button onclick="showLoginModal()" class="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-black px-6 py-2 rounded-lg text-sm font-bold korean-font transition-all duration-300 transform hover:scale-105 shadow-lg">프리미엄 로그인</button>
                        </div>
                    </div>
                    <div class="md:hidden">
                        <button id="mobile-menu-button" class="text-white hover:text-yellow-400 transition-colors">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- 히어로 섹션 -->
        <section id="home" class="hero-bg flex items-center justify-center">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
                <div class="ultra-glass rounded-3xl p-12 max-w-5xl mx-auto luxury-shadow">
                    <h1 class="text-6xl md:text-8xl font-bold text-white mb-8 english-font leading-tight">
                        <span class="gold-gradient">BORACAY</span><br>
                        <span class="text-4xl md:text-5xl tracking-wider">SILVERTOWN</span><br>
                        <span class="korean-font text-2xl md:text-3xl font-light tracking-wide opacity-90">세계 최고 수준의 프리미엄 시니어 레지던스</span>
                    </h1>
                    <p class="text-xl md:text-2xl text-white mb-10 korean-font leading-relaxed opacity-95 max-w-3xl mx-auto">
                        한국 왕실의 품격과 현대적 럭셔리의 완벽한 조화<br>
                        보라카이에서 경험하는 세계 최고 수준의 시니어 라이프스타일
                    </p>
                    <div class="flex flex-col sm:flex-row gap-6 justify-center">
                        <a href="/perspective" class="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-10 py-5 rounded-full text-lg font-bold korean-font transition-all transform hover:scale-105 shadow-2xl border-2 border-blue-400 inline-block">
                            <i class="fas fa-eye mr-3"></i>3D 투시도 탐험
                        </a>
                        <button onclick="showRegisterModal()" class="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700 text-black px-10 py-5 rounded-full text-lg font-bold korean-font transition-all transform hover:scale-105 shadow-2xl border-2 border-yellow-400">
                            <i class="fas fa-crown mr-3"></i>프리미엄 사전등록
                        </button>
                        <button onclick="showInquiryModal()" class="bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-10 py-5 rounded-full text-lg font-bold korean-font transition-all transform hover:scale-105">
                            <i class="fas fa-phone mr-3"></i>VIP 상담 문의
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
                        <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/6b57e988-2803-422b-90dc-5bf202ec9a7a" 
                             alt="하이엔드 한국 전통 로비" class="rounded-2xl shadow-2xl">
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
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/adfc8ff3-ce2d-4072-a946-444d6d1c790b" 
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
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/d5251051-028b-4fa9-8692-b8ea6268754c" 
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
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/500e68f0-715b-4004-85b3-ebd5abaa1dfb" 
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
                            <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/2460e2a2-2ef3-4892-85dc-ce380b7947c1" 
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
                    <img src="https://cdn1.genspark.ai/user-upload-image/4_generated/8bec460f-13f9-4eb2-946d-4edb04b7b651" 
                         alt="하이엔드 편의시설" class="w-full rounded-2xl shadow-2xl">
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

// 관리자 API 엔드포인트들
app.get('/api/admin/members', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  
  try {
    const result = await db.execute(
      'SELECT id, name, email, phone, created_at FROM members ORDER BY created_at DESC LIMIT 100',
      []
    );
    
    return c.json({ members: result.results });
  } catch (error) {
    console.error('회원 목록 조회 실패:', error);
    return c.json({ error: '회원 목록을 불러올 수 없습니다.' }, 500);
  }
});

app.get('/api/admin/applications', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  
  try {
    const result = await db.execute(`
      SELECT 
        pa.id, pa.member_id, pa.membership_type_id, pa.floor_preference, 
        pa.direction_preference, pa.payment_method, pa.status, pa.created_at,
        m.name as member_name, m.email as member_email,
        mt.name as membership_type_name, mt.price
      FROM pre_purchase_applications pa
      JOIN members m ON pa.member_id = m.id
      JOIN membership_types mt ON pa.membership_type_id = mt.id
      ORDER BY pa.created_at DESC
      LIMIT 100
    `, []);
    
    return c.json({ applications: result.results });
  } catch (error) {
    console.error('신청 목록 조회 실패:', error);
    return c.json({ error: '신청 목록을 불러올 수 없습니다.' }, 500);
  }
});

app.get('/api/admin/inquiries', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  
  try {
    const result = await db.execute(
      'SELECT id, name, email, category, subject, message, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 100',
      []
    );
    
    return c.json({ inquiries: result.results });
  } catch (error) {
    console.error('문의 목록 조회 실패:', error);
    return c.json({ error: '문의 목록을 불러올 수 없습니다.' }, 500);
  }
});

app.put('/api/admin/applications/:id/approve', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const applicationId = c.req.param('id');
  
  try {
    await db.execute(
      'UPDATE pre_purchase_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['approved', applicationId]
    );
    
    return c.json({ success: true, message: '신청이 승인되었습니다.' });
  } catch (error) {
    console.error('신청 승인 실패:', error);
    return c.json({ error: '신청 승인에 실패했습니다.' }, 500);
  }
});

app.put('/api/admin/applications/:id/reject', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const applicationId = c.req.param('id');
  
  try {
    await db.execute(
      'UPDATE pre_purchase_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['rejected', applicationId]
    );
    
    return c.json({ success: true, message: '신청이 거절되었습니다.' });
  } catch (error) {
    console.error('신청 거절 실패:', error);
    return c.json({ error: '신청 거절에 실패했습니다.' }, 500);
  }
});

app.put('/api/admin/inquiries/:id/respond', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const inquiryId = c.req.param('id');
  const { response } = await c.req.json();
  
  try {
    await db.execute(
      'UPDATE inquiries SET admin_response = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [response, 'answered', inquiryId]
    );
    
    return c.json({ success: true, message: '답변이 등록되었습니다.' });
  } catch (error) {
    console.error('답변 등록 실패:', error);
    return c.json({ error: '답변 등록에 실패했습니다.' }, 500);
  }
});

app.delete('/api/admin/members/:id', requireAdmin, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const memberId = c.req.param('id');
  
  try {
    await db.execute('DELETE FROM members WHERE id = ?', [memberId]);
    return c.json({ success: true, message: '회원이 삭제되었습니다.' });
  } catch (error) {
    console.error('회원 삭제 실패:', error);
    return c.json({ error: '회원 삭제에 실패했습니다.' }, 500);
  }
});

// 결제 시스템 API
app.post('/api/payment/create-intent', requireAuth, async (c) => {
  const { env } = c;
  const { amount, membershipTypeId, currency = 'usd' } = await c.req.json();
  
  try {
    // Stripe Payment Intent 생성 (실제 환경에서는 Stripe 라이브러리 사용 권장)
    const paymentIntentData = {
      amount: amount * 100, // cents로 변환
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        membership_type_id: membershipTypeId.toString(),
        user_id: c.get('userId').toString()
      }
    };

    // 실제 환경에서는 env.STRIPE_SECRET_KEY 사용
    // 데모용으로 모의 응답 반환
    const mockPaymentIntent = {
      id: 'pi_mock_' + Date.now(),
      client_secret: 'pi_mock_' + Date.now() + '_secret',
      status: 'requires_payment_method'
    };
    
    return c.json({
      clientSecret: mockPaymentIntent.client_secret,
      paymentIntentId: mockPaymentIntent.id
    });
  } catch (error) {
    console.error('결제 인텐트 생성 실패:', error);
    return c.json({ error: '결제 준비 중 오류가 발생했습니다.' }, 500);
  }
});

app.post('/api/payment/confirm', requireAuth, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const { paymentIntentId, membershipTypeId, floorPreference, directionPreference } = await c.req.json();
  const userId = c.get('userId');
  
  try {
    // 실제 환경에서는 Stripe API로 결제 상태 확인
    // 데모용으로 결제 성공으로 가정
    const paymentSuccess = true;
    
    if (paymentSuccess) {
      // 결제 성공 시 사전구매 신청 상태를 'paid'로 저장
      await db.execute(`
        INSERT INTO pre_purchase_applications 
        (member_id, membership_type_id, floor_preference, direction_preference, payment_method, status, payment_intent_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, membershipTypeId, floorPreference, directionPreference, 'stripe', 'paid', paymentIntentId]);
      
      // 결제 로그 기록
      await db.execute(`
        INSERT INTO activity_logs (member_id, action, details, created_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [userId, 'payment_completed', `회원권 사전구매 결제 완료: ${paymentIntentId}`]);
      
      return c.json({ 
        success: true, 
        message: '결제가 완료되었습니다. 사전구매 신청이 접수되었습니다.' 
      });
    } else {
      return c.json({ 
        error: '결제가 완료되지 않았습니다.',
        status: 'failed'
      }, 400);
    }
  } catch (error) {
    console.error('결제 확인 실패:', error);
    return c.json({ error: '결제 확인 중 오류가 발생했습니다.' }, 500);
  }
});

// 결제 페이지
app.get('/payment/:membershipTypeId', requireAuth, async (c) => {
  const { env } = c;
  const db = new DatabaseService(env.DB);
  const membershipTypeId = c.req.param('membershipTypeId');
  
  try {
    // 회원권 정보 조회
    const membershipResult = await db.execute(
      'SELECT * FROM membership_types WHERE id = ?', 
      [membershipTypeId]
    );
    
    if (membershipResult.results.length === 0) {
      return c.text('회원권 정보를 찾을 수 없습니다.', 404);
    }
    
    const membership = membershipResult.results[0];
    
    return c.html(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>결제하기 | Boracay Silvertown</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
          <link href="/static/style.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:wght@400;700&display=swap');
            
            .korean-font { font-family: 'Noto Sans KR', sans-serif; }
            .english-font { font-family: 'Playfair Display', serif; }
            
            .payment-container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              padding: 2rem 0;
            }
            
            .payment-card {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            
            .membership-summary {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              border-radius: 15px;
              padding: 25px;
              margin-bottom: 30px;
              border-left: 5px solid #ffd700;
            }
            
            .payment-form {
              background: #f8f9fa;
              border-radius: 15px;
              padding: 25px;
            }
            
            .form-group {
              margin-bottom: 20px;
            }
            
            .form-label {
              display: block;
              font-weight: 600;
              color: #374151;
              margin-bottom: 8px;
            }
            
            .form-select, .form-input {
              width: 100%;
              padding: 12px 15px;
              border: 2px solid #e5e7eb;
              border-radius: 10px;
              background: white;
              font-size: 16px;
              transition: border-color 0.3s ease;
            }
            
            .form-select:focus, .form-input:focus {
              outline: none;
              border-color: #667eea;
            }
            
            .pay-button {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 15px 30px;
              border-radius: 30px;
              border: none;
              font-weight: bold;
              font-size: 18px;
              cursor: pointer;
              transition: all 0.3s ease;
              width: 100%;
            }
            
            .pay-button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            }
            
            .pay-button:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }
          </style>
      </head>
      <body>
          <div class="payment-container">
              <div class="container mx-auto px-4">
                  <div class="payment-card">
                      <div class="text-center mb-8">
                          <h1 class="text-3xl font-bold korean-font text-gray-800 mb-2">결제하기</h1>
                          <p class="text-gray-600 korean-font">보라카이 실버타운 사전구매</p>
                      </div>
                      
                      <!-- 회원권 요약 -->
                      <div class="membership-summary">
                          <div class="flex justify-between items-start mb-4">
                              <div>
                                  <h3 class="text-xl font-bold korean-font text-gray-800">${membership.name}</h3>
                                  <p class="text-gray-600 korean-font">${membership.size}㎡ (${(membership.size / 3.3).toFixed(1)}평)</p>
                              </div>
                              <div class="text-right">
                                  <p class="text-2xl font-bold text-green-600">$${membership.price.toLocaleString()}</p>
                                  <p class="text-sm text-gray-500 korean-font">USD</p>
                              </div>
                          </div>
                          <div class="text-sm text-gray-600 korean-font">
                              <p>${membership.description}</p>
                          </div>
                      </div>
                      
                      <!-- 옵션 선택 -->
                      <div class="mb-6">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div class="form-group">
                                  <label class="form-label korean-font">선호 층수</label>
                                  <select id="floor-preference" class="form-select korean-font">
                                      <option value="">선택해주세요</option>
                                      <option value="2">2층</option>
                                      <option value="3">3층</option>
                                      <option value="4">4층 (최상층)</option>
                                  </select>
                              </div>
                              <div class="form-group">
                                  <label class="form-label korean-font">선호 방향</label>
                                  <select id="direction-preference" class="form-select korean-font">
                                      <option value="">선택해주세요</option>
                                      <option value="ocean_view">오션뷰</option>
                                      <option value="garden_view">가든뷰</option>
                                      <option value="mountain_view">마운틴뷰</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                      
                      <!-- 결제 폼 (데모용) -->
                      <div class="payment-form">
                          <h3 class="text-lg font-bold korean-font text-gray-800 mb-4">결제 정보</h3>
                          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                              <div class="flex">
                                  <div class="flex-shrink-0">
                                      <i class="fas fa-info-circle text-yellow-400"></i>
                                  </div>
                                  <div class="ml-3">
                                      <p class="text-sm text-yellow-700 korean-font">
                                          <strong>데모 버전:</strong> 실제 결제는 이루어지지 않습니다. 
                                          Stripe 연동은 실제 서비스 시 활성화됩니다.
                                      </p>
                                  </div>
                              </div>
                          </div>
                          <form id="payment-form">
                              <div class="form-group">
                                  <label class="form-label korean-font">카드 번호 (데모용)</label>
                                  <input type="text" class="form-input" placeholder="4242 4242 4242 4242" readonly>
                              </div>
                              
                              <div class="grid grid-cols-2 gap-4">
                                  <div class="form-group">
                                      <label class="form-label korean-font">만료일</label>
                                      <input type="text" class="form-input" placeholder="12/25" readonly>
                                  </div>
                                  <div class="form-group">
                                      <label class="form-label korean-font">CVC</label>
                                      <input type="text" class="form-input" placeholder="123" readonly>
                                  </div>
                              </div>
                              
                              <button type="submit" id="submit" class="pay-button korean-font">
                                  <span id="button-text">$${membership.price.toLocaleString()} 결제하기 (데모)</span>
                                  <span id="spinner" class="hidden">
                                      <i class="fas fa-spinner fa-spin mr-2"></i>처리중...
                                  </span>
                              </button>
                          </form>
                      </div>
                      
                      <!-- 보안 정보 -->
                      <div class="mt-6 text-center">
                          <div class="flex items-center justify-center space-x-4 text-sm text-gray-500">
                              <div class="flex items-center">
                                  <i class="fas fa-lock mr-1"></i>
                                  <span class="korean-font">SSL 보안</span>
                              </div>
                              <div class="flex items-center">
                                  <i class="fab fa-cc-stripe mr-1"></i>
                                  <span>Stripe</span>
                              </div>
                              <div class="flex items-center">
                                  <i class="fas fa-shield-alt mr-1"></i>
                                  <span class="korean-font">안전 결제</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          
          <script>
              // 데모용 결제 폼 제출
              const form = document.getElementById('payment-form');
              form.addEventListener('submit', async (event) => {
                  event.preventDefault();
                  
                  const submitButton = document.getElementById('submit');
                  const buttonText = document.getElementById('button-text');
                  const spinner = document.getElementById('spinner');
                  
                  // 버튼 상태 변경
                  submitButton.disabled = true;
                  buttonText.classList.add('hidden');
                  spinner.classList.remove('hidden');
                  
                  try {
                      // 데모용 지연
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      
                      // 결제 확인 API 호출
                      const confirmResponse = await fetch('/api/payment/confirm', {
                          method: 'POST',
                          headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer ' + localStorage.getItem('token')
                          },
                          body: JSON.stringify({
                              paymentIntentId: 'demo_payment_' + Date.now(),
                              membershipTypeId: ${membershipTypeId},
                              floorPreference: document.getElementById('floor-preference').value,
                              directionPreference: document.getElementById('direction-preference').value
                          })
                      });
                      
                      const confirmResult = await confirmResponse.json();
                      
                      if (confirmResult.success) {
                          alert('결제가 완료되었습니다! 사전구매 신청이 접수되었습니다.');
                          window.location.href = '/';
                      } else {
                          alert('결제 처리 중 문제가 발생했습니다.');
                      }
                  } catch (error) {
                      console.error('결제 에러:', error);
                      alert('결제 중 오류가 발생했습니다.');
                  } finally {
                      // 버튼 상태 복원
                      submitButton.disabled = false;
                      buttonText.classList.remove('hidden');
                      spinner.classList.add('hidden');
                  }
              });
          </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('결제 페이지 로드 실패:', error);
    return c.text('페이지를 불러올 수 없습니다.', 500);
  }
});

export default app
