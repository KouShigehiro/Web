// ===== 主题切换 (浅色/深色) =====
(function () {
    const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');

    // 读取偏好: localStorage > 系统偏好 > 默认浅色
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ? stored === 'dark' : prefersDark;

    const apply = (isDark) => {
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        if (toggle) toggle.checked = isDark;
    };
    apply(initial);

    toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        root.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // 跟随系统变化 (仅在用户未手动设置时)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) apply(e.matches);
    });
})();

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
});

// ===== 移动端菜单 =====
const burger = document.getElementById('navBurger');
const menu = document.querySelector('.nav-menu');
burger.addEventListener('click', () => menu.classList.toggle('active'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('active')));

// ===== 二维码弹窗 (微信/QQ) =====
const qrModal = document.getElementById('qrModal');
const qrImage = document.getElementById('qrImage');
const qrTitle = document.getElementById('qrTitle');
const qrClose = document.getElementById('qrClose');
const qrBackdrop = document.getElementById('qrBackdrop');

document.querySelectorAll('.social-btn[data-qr]').forEach(btn => {
    btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-qr');
        const title = btn.getAttribute('data-title');
        qrImage.src = src;
        qrTitle.textContent = title;
        qrModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeQr = () => {
    qrModal.classList.remove('active');
    document.body.style.overflow = '';
};
qrClose.addEventListener('click', closeQr);
qrBackdrop.addEventListener('click', closeQr);

// ===== 邮箱弹窗 (iMessage) =====
const emailModal = document.getElementById('emailModal');
const emailText = document.getElementById('emailText');
const emailTitle = document.getElementById('emailTitle');
const emailClose = document.getElementById('emailClose');
const emailBackdrop = document.getElementById('emailBackdrop');
const emailCopy = document.getElementById('emailCopy');

document.querySelectorAll('.social-btn[data-email]').forEach(btn => {
    btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const title = btn.getAttribute('data-title');
        emailText.textContent = email;
        emailTitle.textContent = title;
        emailCopy.classList.remove('copied');
        emailCopy.innerHTML = '<i class="fas fa-copy"></i> 复制邮箱';
        emailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeEmail = () => {
    emailModal.classList.remove('active');
    document.body.style.overflow = '';
};
emailClose.addEventListener('click', closeEmail);
emailBackdrop.addEventListener('click', closeEmail);

// 复制邮箱
emailCopy.addEventListener('click', async () => {
    const email = emailText.textContent;
    try {
        await navigator.clipboard.writeText(email);
    } catch {
        const ta = document.createElement('textarea');
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
    emailCopy.classList.add('copied');
    emailCopy.innerHTML = '<i class="fas fa-check"></i> 已复制';
    setTimeout(() => {
        emailCopy.classList.remove('copied');
        emailCopy.innerHTML = '<i class="fas fa-copy"></i> 复制邮箱';
    }, 1800);
});

// Esc 关闭所有弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeQr(); closeEmail(); }
});

// ===== 滚动入场动画 =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.gallery-card, .about-image, .about-text, .social-btn, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
