gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const petalContainer = document.getElementById("falling-flowers-container");
const colors = ["#ffb7c5", "#ffc0cb", "#fff0f5", "#ffd1dc"];
const shapes = ["15px 0 15px 0", "50%", "10px 5px 10px 5px"];

for (let i = 0; i < 40; i++) {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.style.left = Math.random() * 100 + "vw";

    const size = Math.random() * 12 + 8;
    petal.style.width = size + "px";
    petal.style.height = size + "px";

    petal.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
    petal.style.background = colors[Math.floor(Math.random() * colors.length)];

    petal.style.animationDuration = Math.random() * 5 + 6 + "s";
    petal.style.animationDelay = Math.random() * 5 + "s";

    petalContainer.appendChild(petal);
}

gsap.set(".scene:not(.intro-scene)", { scale: 0.1, opacity: 0, filter: "blur(0px)", zIndex: 10 });
gsap.set(".intro-scene", { scale: 1, opacity: 1, zIndex: 20 });

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
            if (self.progress > 0.12) {
                petalContainer.style.opacity = 1;
            } else {
                petalContainer.style.opacity = 0;
            }

            // 当滚动达到 99% 时，加上交互悬停高亮效果
            if (self.progress > 0.99) {
                document.querySelectorAll(".scene:not(.intro-scene)").forEach(scene => {
                    scene.classList.add("scene-interactive");
                });
            } else {
                document.querySelectorAll(".scene:not(.intro-scene)").forEach(scene => {
                    scene.classList.remove("scene-interactive");
                });
            }
        }
    }
});

// 大门 3D 旋转开门效果
tl.to(".gate-left", { rotationY: 100, duration: 1.5, ease: "power2.inOut" }, 0)
    .to(".gate-right", { rotationY: -100, duration: 1.5, ease: "power2.inOut" }, 0)
    .to(".gate-wrapper", { z: 400, opacity: 0, duration: 1.5 }, 0.5)
    .to(".intro-scene", { scale: 4, opacity: 0, duration: 1 }, 1.5)
    .to(".scene-1", { scale: 1, opacity: 1, zIndex: 30, duration: 1 }, 2)
    .to(".scene-1", { scale: 0.85, x: "28vw", y: "-8vh", zIndex: 10, filter: "blur(6px)", duration: 1 }, 3)
    .to(".scene-1 .text-box", { opacity: 0, duration: 0.5 }, 3)
    .to(".scene-2", { scale: 1, opacity: 1, zIndex: 30, duration: 1 }, 3)
    .to(".scene-2", { scale: 0.75, x: "-34vw", y: "-8vh", zIndex: 11, filter: "blur(6px)", duration: 1 }, 4)
    .to(".scene-2 .text-box", { opacity: 0, duration: 0.5 }, 4)
    .to(".scene-3", { scale: 1, opacity: 1, zIndex: 30, duration: 1 }, 4)
    .to(".scene-3", { scale: 0.75, x: "18vw", y: "15vh", zIndex: 12, filter: "blur(6px)", duration: 1 }, 5)
    .to(".scene-3 .text-box", { opacity: 0, duration: 0.5 }, 5)
    .to(".scene-4", { scale: 1, opacity: 1, zIndex: 30, duration: 1 }, 5)
    .to(".scene-4", { scale: 1.10, x: "-12vw", y: "10vh", zIndex: 13, duration: 1 }, 6)
    .to(".scene-4 .text-box", { opacity: 0, duration: 0.5 }, 6)
    .to(".scene-1", { filter: "blur(0px)", duration: 1 }, 6)
    .to(".scene-2", { filter: "blur(0px)", duration: 1 }, 6)
    .to(".scene-3", { filter: "blur(0px)", duration: 1 }, 6);

const interactionUrls = [
    { selector: ".scene-1", url: "garden-atlas.html" },
    { selector: ".scene-2", url: "framed-views.html" },
    { selector: ".scene-3", url: "our-journey.html" },
    { selector: ".scene-4", url: "echo-pavilion.html" }
];

interactionUrls.forEach(data => {
    const el = document.querySelector(data.selector);
    el.addEventListener("click", () => {
        if (el.classList.contains("scene-interactive")) {
            window.open(data.url, "_blank");
        }
    });
});

// 点击直接精确滚动到 4 个图像完全就位的位置
document.getElementById('openGateBtn').addEventListener('click', () => {
    const targetScroll = document.querySelector('.scroll-container').offsetHeight - window.innerHeight;

    gsap.to(window, {
        duration: 3,
        scrollTo: targetScroll,
        ease: "power2.inOut"
    });
});

// 全局导航栏花瓣特效
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