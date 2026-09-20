gsap.registerPlugin(ScrollTrigger);

// 介绍面板在滚动初始阶段平滑隐退
gsap.to(".fixed-intro", {
    opacity: 0,
    x: -50, // 伴随淡出微微向左滑动退出
    pointerEvents: "none", // 隐退后不阻挡鼠标点击事件
    scrollTrigger: {
        trigger: ".horizontal-container",
        start: "top top",
        end: "10% top", // 在页面滚动的前 10% 阶段完成隐退
        scrub: true
    }
});

const scrollWrapper = document.querySelector(".scroll-wrapper");
const sections = gsap.utils.toArray(".pair-section");

// 横向滚动与精确吸附逻辑
let horizontalTween = gsap.to(scrollWrapper, {
    x: () => -(scrollWrapper.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontal-container",
        pin: true,
        scrub: 1,
        end: () => "+=" + (scrollWrapper.scrollWidth - window.innerWidth),
        invalidateOnRefresh: true, // 窗口大小改变时重新计算距离
        snap: {
            // 动态计算每个借景卡片对应的滚动进度百分比 (0 到 1)
            snapTo: (progress, self) => {
                const maxScroll = scrollWrapper.scrollWidth - window.innerWidth;
                const points = sections.map(section => section.offsetLeft / maxScroll);
                // 自动吸附到离当前滑动进度最近的卡片点位
                return gsap.utils.snap(points, progress);
            },
            duration: { min: 0.3, max: 0.8 }, // 吸附滑动的过渡时间范围
            delay: 0.15, // 停止滚动 0.15 秒后触发自动吸附
            ease: "power2.inOut" // 丝滑的加减速缓冲
        }
    }
});

sections.forEach((section) => {
    const teamLeft = section.querySelector(".team-left");
    const teamRight = section.querySelector(".team-right");
    const windowCard = section.querySelector(".window-card");

    // 左侧队伍卡片入场动画
    gsap.from(teamLeft, {
        x: -80,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: section,
            containerAnimation: horizontalTween,
            start: "left center",
            toggleActions: "play none none reverse"
        }
    });

    // 右侧队伍卡片入场动画
    gsap.from(teamRight, {
        x: 80,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: section,
            containerAnimation: horizontalTween,
            start: "left center",
            toggleActions: "play none none reverse"
        }
    });

    // 中间窗户卡片入场动画
    gsap.from(windowCard, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
            trigger: section,
            containerAnimation: horizontalTween,
            start: "left center",
            toggleActions: "play none none reverse"
        }
    });

    // 翻转窗户事件绑定
    const btnPush = section.querySelector(".btn-push-window");
    const btnSwitch = section.querySelector(".btn-switch-view");

    if (btnPush && btnSwitch && windowCard) {
        btnPush.addEventListener("click", () => {
            windowCard.classList.add("is-open");
        });

        btnSwitch.addEventListener("click", () => {
            windowCard.classList.remove("is-open");
        });
    }
});

// 导航栏花瓣特效
const globalNavItems = gsap.utils.toArray('.nav-item');

function createGlobalNavPetal(parent) {
    const petal = document.createElement('div');
    petal.classList.add('nav-petal');
    parent.appendChild(petal);

    const startX = Math.random() * parent.offsetWidth;
    const startY = -10;

    gsap.set(petal, {
        x: startX,
        y: startY,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
    });

    gsap.to(petal, {
        y: parent.offsetHeight + 10,
        x: startX + (Math.random() * 20 - 10),
        rotation: "+=" + (Math.random() * 200 - 100),
        opacity: 0,
        duration: 0.5 + Math.random() * 0.4,
        ease: "power1.in",
        onComplete: () => petal.remove()
    });
}

globalNavItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        for (let j = 0; j < 6; j++) {
            setTimeout(() => {
                createGlobalNavPetal(item);
            }, j * 60);
        }
    });
});

/* ================= 移动端汉堡菜单交互 ================= */
const hamburger = document.getElementById('hamburger');
const navRight = document.getElementById('nav-right');
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        navRight.classList.toggle('is-active');
    });
}

if (mobileDropdownToggle) {
    mobileDropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
            e.preventDefault(); // 移动端点击不跳转，而是展开子菜单
            dropdownContent.classList.toggle('is-expanded');
            const arrow = mobileDropdownToggle.querySelector('.dropdown-arrow');
            if (dropdownContent.classList.contains('is-expanded')) {
                arrow.style.transform = 'rotate(225deg) translate(-2px, -2px)';
            } else {
                arrow.style.transform = 'rotate(45deg) translateY(-2px)';
            }
        }
    });
}