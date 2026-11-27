// FUNGSI BERPINDAH DASHBOARD TANPA SCROLL KE BAWAH
function switchTab(targetId) {
    const pages = document.querySelectorAll('.dashboard-page');
    const buttons = document.querySelectorAll('.tab-btn');

    pages.forEach(page => page.classList.remove('active-page'));

    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        }
    });

    // Kunci scroll hanya pada halaman Profile agar pas 1 layar laptop
    if (targetId === 'profil') {
        document.body.classList.add('lock-scroll');
    } else {
        document.body.classList.remove('lock-scroll');
    }

    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        void targetPage.offsetWidth;
        targetPage.classList.add('active-page');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // 1. MUAT BACKGROUND KHUSUS UNTUK MASING-MASING DASHBOARD (Folder: images/backgrounds/)
    const dashboardPages = document.querySelectorAll('.dashboard-page');
    dashboardPages.forEach(page => {
        const bgUrl = page.getAttribute('data-bg');
        const bgLayer = page.querySelector('.page-bg');
        if (bgUrl && bgLayer) {
            const testImg = new Image();
            testImg.src = bgUrl;
            testImg.onload = () => {
                bgLayer.style.backgroundImage = `url('${bgUrl}')`;
            };
        }
    });

    // 2. AKTIFKAN KLIK TOMBOL MENU NAVIGASI ATAS
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            switchTab(target);
        });
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    function openLightbox(src) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
    }

    // 3. SLIDER EDUCATION (IJAZAH & TRANSKRIP) SERTA CERTIFICATIONS
    const sliders = document.querySelectorAll('.auto-slider');
    sliders.forEach(slider => {
        const folder = slider.getAttribute('data-folder');
        const slidesContainer = slider.querySelector('.slides');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentIndex = 0;
        let slides = [];

        function loadSequential(num) {
            if (num > 30) return;
            const img = new Image();
            img.src = `${folder}/${num}.jpg`;
            img.onload = () => {
                const div = document.createElement('div');
                div.className = 'slide' + (slides.length === 0 ? ' active' : '');
                img.addEventListener('click', () => openLightbox(img.src));
                div.appendChild(img);
                slidesContainer.appendChild(div);
                slides.push(div);
                loadSequential(num + 1);
            };
        }
        loadSequential(1);

        function showSlide(idx) {
            if (slides.length <= 1) return;
            slides[currentIndex].classList.remove('active');
            currentIndex = (idx + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
        }

        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
        setInterval(() => showSlide(currentIndex + 1), 3800);
    });

    // 4. KARTU LANDSCAPE INTERAKTIF (Work Experience, Projects, Internship)
    const cards = document.querySelectorAll('.modern-card');
    cards.forEach(card => {
        const folder = card.getAttribute('data-folder');
        const mainPhoto = card.querySelector('.main-photo');
        const thumbStrip = card.querySelector('.thumb-strip');
        let photoUrls = [];
        let activeIdx = 0;

        if (mainPhoto) {
            mainPhoto.addEventListener('click', () => {
                if (mainPhoto.src) openLightbox(mainPhoto.src);
            });
        }

        function changeMainPhoto(newIdx) {
            if (photoUrls.length === 0 || !mainPhoto) return;
            activeIdx = newIdx;
            mainPhoto.classList.add('photo-switching');
            setTimeout(() => {
                mainPhoto.src = photoUrls[activeIdx];
                mainPhoto.classList.remove('photo-switching');
            }, 220);
            updateActiveThumb();
        }

        function loadCardPhotos(num) {
            if (num > 30) return;
            const img = new Image();
            img.src = `${folder}/${num}.jpg`;

            img.onload = () => {
                const currentIdx = photoUrls.length;
                photoUrls.push(img.src);

                if (currentIdx === 0 && mainPhoto) {
                    mainPhoto.src = img.src;
                }

                if (thumbStrip) {
                    const thumb = document.createElement('img');
                    thumb.src = img.src;
                    if (currentIdx === 0) thumb.classList.add('active-thumb');

                    thumb.addEventListener('click', () => {
                        changeMainPhoto(currentIdx);
                    });

                    thumbStrip.appendChild(thumb);
                }
                loadCardPhotos(num + 1);
            };

            img.onerror = () => {
                if (photoUrls.length <= 1 && thumbStrip) {
                    thumbStrip.style.display = 'none';
                }
            };
        }

        function updateActiveThumb() {
            if (!thumbStrip) return;
            const thumbs = thumbStrip.querySelectorAll('img');
            thumbs.forEach((t, i) => {
                t.classList.toggle('active-thumb', i === activeIdx);
            });
        }

        loadCardPhotos(1);

        setInterval(() => {
            if (photoUrls.length > 1) {
                const nextIdx = (activeIdx + 1) % photoUrls.length;
                changeMainPhoto(nextIdx);
            }
        }, 3800);
    });
});