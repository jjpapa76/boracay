// 보라카이 실버타운 프론트엔드 JavaScript

// 전역 변수
let currentUser = null;
let membershipTypes = [];

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('보라카이 실버타운 시스템 초기화...');
    
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem('token');
    if (token) {
        // 토큰이 있으면 사용자 정보 로드
        loadUserInfo(token);
    }
    
    // 회원권 타입 로드
    loadMembershipTypes();
    
    // 이벤트 리스너 등록
    initEventListeners();
    
    // 스무스 스크롤 설정
    initSmoothScroll();
});

// 이벤트 리스너 초기화
function initEventListeners() {
    // 로그인 폼
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 회원가입 폼
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // 문의 폼
    const inquiryForm = document.getElementById('inquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', handleInquiry);
    }
    
    // 뉴스레터 폼
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }
    
    // 모바일 메뉴 토글
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideAllModals();
        }
    });
}

// 스무스 스크롤 초기화
function initSmoothScroll() {
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    
    try {
        showLoading('로그인 중...');
        
        const response = await axios.post('/api/auth/login', loginData);
        
        if (response.data.success) {
            // 토큰 저장
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.member));
            
            currentUser = response.data.member;
            
            showSuccess(response.data.message);
            hideLoginModal();
            updateUIForLoggedInUser();
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        showError(error.response?.data?.error || '로그인에 실패했습니다.');
    } finally {
        hideLoading();
    }
}

// 회원가입 처리
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showError('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    const registerData = {
        email: formData.get('email'),
        password: password,
        name: formData.get('name'),
        phone: formData.get('phone'),
        birth_date: formData.get('birth_date'),
        nationality: formData.get('nationality') || 'KR',
        preferred_language: formData.get('preferred_language') || 'ko'
    };
    
    try {
        showLoading('회원가입 중...');
        
        const response = await axios.post('/api/auth/register', registerData);
        
        if (response.data.success) {
            // 토큰 저장
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.member));
            
            currentUser = response.data.member;
            
            showSuccess(response.data.message);
            hideRegisterModal();
            updateUIForLoggedInUser();
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        showError(error.response?.data?.error || '회원가입에 실패했습니다.');
    } finally {
        hideLoading();
    }
}

// 문의사항 처리
async function handleInquiry(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const inquiryData = {
        name: formData.get('name'),\n        email: formData.get('email'),\n        phone: formData.get('phone'),\n        subject: formData.get('subject'),\n        message: formData.get('message'),\n        category: formData.get('category') || 'general'\n    };\n    \n    try {\n        showLoading('문의사항 전송 중...');\n        \n        const headers = {};\n        const token = localStorage.getItem('token');\n        if (token) {\n            headers['Authorization'] = `Bearer ${token}`;\n        }\n        \n        const response = await axios.post('/api/inquiries', inquiryData, { headers });\n        \n        if (response.data.success) {\n            showSuccess(response.data.message);\n            hideInquiryModal();\n            event.target.reset();\n        }\n    } catch (error) {\n        console.error('문의사항 오류:', error);\n        showError(error.response?.data?.error || '문의사항 전송에 실패했습니다.');\n    } finally {\n        hideLoading();\n    }\n}\n\n// 사전구매 신청\nasync function applyPrePurchase(membershipTypeId) {\n    if (!currentUser) {\n        showError('로그인이 필요합니다.');\n        showLoginModal();\n        return;\n    }\n    \n    const applicationData = {\n        membership_type_id: membershipTypeId,\n        preferred_floor: prompt('선호하는 층수를 입력해주세요 (1-4):'),\n        preferred_orientation: prompt('선호하는 전망을 선택해주세요 (ocean_view/mountain_view/garden_view):'),\n        payment_method: confirm('일시불로 결제하시겠습니까?') ? 'full_payment' : 'installment',\n        deposit_amount: 0\n    };\n    \n    try {\n        showLoading('사전구매 신청 중...');\n        \n        const token = localStorage.getItem('token');\n        const response = await axios.post('/api/pre-purchase', applicationData, {\n            headers: {\n                'Authorization': `Bearer ${token}`\n            }\n        });\n        \n        if (response.data.success) {\n            showSuccess(response.data.message);\n        }\n    } catch (error) {\n        console.error('사전구매 신청 오류:', error);\n        showError(error.response?.data?.error || '사전구매 신청에 실패했습니다.');\n    } finally {\n        hideLoading();\n    }\n}\n\n// 회원권 타입 로드\nasync function loadMembershipTypes() {\n    try {\n        const response = await axios.get('/api/membership-types');\n        membershipTypes = response.data.membershipTypes;\n        displayMembershipTypes();\n    } catch (error) {\n        console.error('회원권 타입 로드 오류:', error);\n    }\n}\n\n// 회원권 타입 표시\nfunction displayMembershipTypes() {\n    // 이 함수는 회원권 타입 섹션이 HTML에 추가되면 구현\n    console.log('회원권 타입 로드됨:', membershipTypes);\n}\n\n// 사용자 정보 로드\nasync function loadUserInfo(token) {\n    try {\n        // JWT 토큰 디코딩 (간단한 방식)\n        const base64Url = token.split('.')[1];\n        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');\n        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {\n            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);\n        }).join(''));\n        \n        const payload = JSON.parse(jsonPayload);\n        \n        // 토큰 만료 확인\n        if (payload.exp && payload.exp < Date.now() / 1000) {\n            localStorage.removeItem('token');\n            localStorage.removeItem('user');\n            return;\n        }\n        \n        // 사용자 정보 설정\n        const userData = localStorage.getItem('user');\n        if (userData) {\n            currentUser = JSON.parse(userData);\n            updateUIForLoggedInUser();\n        }\n    } catch (error) {\n        console.error('사용자 정보 로드 오류:', error);\n        localStorage.removeItem('token');\n        localStorage.removeItem('user');\n    }\n}\n\n// 로그인 사용자 UI 업데이트\nfunction updateUIForLoggedInUser() {\n    if (!currentUser) return;\n    \n    // 로그인 버튼을 사용자 이름으로 변경\n    const loginButton = document.querySelector('button[onclick=\"showLoginModal()\"]');\n    if (loginButton) {\n        loginButton.innerHTML = `<i class=\"fas fa-user mr-2\"></i>${currentUser.name}`;\n        loginButton.onclick = showUserMenu;\n    }\n}\n\n// 사용자 메뉴 표시\nfunction showUserMenu() {\n    // 드롭다운 메뉴 구현 (향후 확장)\n    const menu = confirm(`${currentUser.name}님, 로그아웃 하시겠습니까?`);\n    if (menu) {\n        logout();\n    }\n}\n\n// 로그아웃\nfunction logout() {\n    localStorage.removeItem('token');\n    localStorage.removeItem('user');\n    currentUser = null;\n    \n    // UI 원복\n    const userButton = document.querySelector('button');\n    if (userButton && userButton.innerHTML.includes('fas fa-user')) {\n        userButton.innerHTML = '로그인';\n        userButton.onclick = showLoginModal;\n    }\n    \n    showSuccess('로그아웃 되었습니다.');\n    \n    // 메인 페이지로 스크롤\n    document.getElementById('home').scrollIntoView({ behavior: 'smooth' });\n}\n\n// 모달 관리 함수들\nfunction showLoginModal() {\n    document.getElementById('loginModal').classList.remove('hidden');\n    document.body.style.overflow = 'hidden';\n}\n\nfunction hideLoginModal() {\n    document.getElementById('loginModal').classList.add('hidden');\n    document.body.style.overflow = 'auto';\n}\n\nfunction showRegisterModal() {\n    // 회원가입 모달 HTML이 추가되면 구현\n    showModal('registerModal');\n}\n\nfunction hideRegisterModal() {\n    hideModal('registerModal');\n}\n\nfunction showInquiryModal() {\n    // 문의 모달 HTML이 추가되면 구현\n    showModal('inquiryModal');\n}\n\nfunction hideInquiryModal() {\n    hideModal('inquiryModal');\n}\n\nfunction showModal(modalId) {\n    const modal = document.getElementById(modalId);\n    if (modal) {\n        modal.classList.remove('hidden');\n        document.body.style.overflow = 'hidden';\n    }\n}\n\nfunction hideModal(modalId) {\n    const modal = document.getElementById(modalId);\n    if (modal) {\n        modal.classList.add('hidden');\n        document.body.style.overflow = 'auto';\n    }\n}\n\nfunction hideAllModals() {\n    const modals = document.querySelectorAll('[id$=\"Modal\"]');\n    modals.forEach(modal => {\n        modal.classList.add('hidden');\n    });\n    document.body.style.overflow = 'auto';\n}\n\n// 모바일 메뉴 토글\nfunction toggleMobileMenu() {\n    // 모바일 메뉴 구현 (향후 확장)\n    console.log('모바일 메뉴 토글');\n}\n\n// 알림 메시지 함수들\nfunction showLoading(message = '처리 중...') {\n    // 로딩 스피너 표시\n    const loadingDiv = document.createElement('div');\n    loadingDiv.id = 'loading';\n    loadingDiv.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';\n    loadingDiv.innerHTML = `\n        <div class=\"bg-white rounded-lg p-6 flex items-center\">\n            <div class=\"animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mr-4\"></div>\n            <span class=\"korean-font\">${message}</span>\n        </div>\n    `;\n    document.body.appendChild(loadingDiv);\n}\n\nfunction hideLoading() {\n    const loading = document.getElementById('loading');\n    if (loading) {\n        loading.remove();\n    }\n}\n\nfunction showSuccess(message) {\n    showToast(message, 'success');\n}\n\nfunction showError(message) {\n    showToast(message, 'error');\n}\n\nfunction showToast(message, type = 'info') {\n    const toast = document.createElement('div');\n    toast.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 korean-font`;\n    \n    if (type === 'success') {\n        toast.className += ' bg-green-500 text-white';\n        toast.innerHTML = `<i class=\"fas fa-check-circle mr-2\"></i>${message}`;\n    } else if (type === 'error') {\n        toast.className += ' bg-red-500 text-white';\n        toast.innerHTML = `<i class=\"fas fa-exclamation-circle mr-2\"></i>${message}`;\n    } else {\n        toast.className += ' bg-blue-500 text-white';\n        toast.innerHTML = `<i class=\"fas fa-info-circle mr-2\"></i>${message}`;\n    }\n    \n    document.body.appendChild(toast);\n    \n    // 애니메이션 시작\n    setTimeout(() => {\n        toast.classList.remove('translate-x-full');\n    }, 100);\n    \n    // 자동 제거\n    setTimeout(() => {\n        toast.classList.add('translate-x-full');\n        setTimeout(() => {\n            if (toast.parentNode) {\n                toast.parentNode.removeChild(toast);\n            }\n        }, 300);\n    }, 3000);\n}\n\n// 스크롤 이벤트 (애니메이션 트리거)\nwindow.addEventListener('scroll', function() {\n    const scrolled = window.pageYOffset;\n    const rate = scrolled * -0.5;\n    \n    // 패럴랙스 효과\n    const heroSection = document.querySelector('.hero-bg');\n    if (heroSection) {\n        heroSection.style.transform = `translateY(${rate}px)`;\n    }\n});\n\n// 페이지 로드 완료 시 추가 초기화\nwindow.addEventListener('load', function() {\n    console.log('보라카이 실버타운 완전 로드 완료');\n    \n    // 애니메이션 시작\n    const elements = document.querySelectorAll('.animate-fade-in');\n    elements.forEach((element, index) => {\n        setTimeout(() => {\n            element.style.opacity = '1';\n            element.style.transform = 'translateY(0)';\n        }, index * 200);\n    });\n});"}

// 뉴스레터 구독 처리
async function handleNewsletter(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newsletterData = {
        email: formData.get('email'),
        name: formData.get('name'),
        language: 'ko'
    };
    
    try {
        showLoading('뉴스레터 구독 중...');
        
        const response = await axios.post('/api/newsletter/subscribe', newsletterData);
        
        if (response.data.success) {
            showSuccess(response.data.message);
            event.target.reset();
        }
    } catch (error) {
        console.error('뉴스레터 구독 오류:', error);
        showError(error.response?.data?.error || '뉴스레터 구독에 실패했습니다.');
    } finally {
        hideLoading();
    }
}
