// main.js - General functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle - moved to navbar load callback below
    
    // Add focus styles for keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--color-accent')}`;
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Additional functions for main.js

// Active navigation link highlighting
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    
    // Set active navigation link
    setActiveNavLink();
    
    // Add loading state to buttons when forms are submitted
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Skickar...</span>';
                
                // Re-enable after 5 seconds (in case of error)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Skicka</span>';
                }, 5000);
            }
        });
    });

    // Hero background carousel implementation with crossfade
    const heroElement = document.querySelector('.hero');
    if (heroElement) {
        const backgrounds = heroElement.querySelectorAll('.hero-background');
        if (backgrounds.length < 2) return;

        const images = [
            '1/images/mainPic2.jpg',
            '1/images/mainPic3.jpg',
            '1/images/mainPic4.jpg',
            '1/images/mainPic5.jpg'
        ];
        
        let currentIndex = 0;
        let currentBg = 0;

        // Initialize backgrounds
        backgrounds[0].style.backgroundImage = `url('${images[0]}')`;
        backgrounds[0].classList.add('visible');
        backgrounds[1].style.backgroundImage = `url('${images[1]}')`;

        currentIndex = 1;

        function changeBackground() {
            const nextBg = (currentBg + 1) % 2;
            backgrounds[nextBg].style.backgroundImage = `url('${images[currentIndex]}')`;
            backgrounds[nextBg].classList.add('visible');
            backgrounds[currentBg].classList.remove('visible');
            currentBg = nextBg;
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(changeBackground, 4000);
    }
});

 // Load navbar component
document.addEventListener("DOMContentLoaded", () => {
    let path = "";

    if (window.location.pathname.includes("/1/")) {
        // Inside folder 1
        path = "navbar.html";
    } else {
        // In root index.html
        path = "1/navbar.html";
    }

    // Determine base URL prefix for GitHub Pages site or local
    let basePrefix = "";
    if (window.location.hostname.includes("github.io")) {
        basePrefix = "/lejonTKD";
    }

    fetch(path)
        .then(response => response.text())
        .then(data => {
            // Replace all href="/ and src="/ with prefix for GitHub Pages
            const adjustedData = data.replace(/(href|src)="\//g, `$1="${basePrefix}/`);

            document.getElementById("navbar-placeholder").innerHTML = adjustedData;

            // Fix logo image src if on root index.html (image is in 1/images)
            const isIndex = window.location.pathname.endsWith("/index.html") ||
                            window.location.pathname.endsWith("/lejonTKD/");

            if (isIndex) {
                const logoImg = document.querySelector('#navbar-placeholder img.logo-image');
                if (logoImg && logoImg.getAttribute('src').startsWith('images')) {
                    logoImg.src = basePrefix + '/1/' + logoImg.getAttribute('src');
                }
            }

            // Fix logo link href if inside 1/ folder
            const isInside1 = window.location.pathname.includes("/1/");

            if (isInside1) {
                const logoLink = document.querySelector('#navbar-placeholder a.logo');
                if (logoLink) {
                    logoLink.href = basePrefix + '/index.html';
                }
            }

            // If on root page, fix all nav links to prepend '1/' folder
            const isRoot = !window.location.pathname.includes("/1/");

            if (isRoot) {
                const navLinks = document.querySelectorAll('#navbar-placeholder ul.nav-menu a.nav-link');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (!href.startsWith('http') && !href.startsWith('https') && !href.startsWith('mailto:') && !href.startsWith('#')) {
                        // Prepend '1/' folder, avoiding duplicates
                        if (!href.startsWith('1/')) {
                            link.href = basePrefix + '/1/' + href;
                        } else {
                            link.href = basePrefix + '/' + href;
                        }
                    }
                });
            }

            // CREATE "Hem" link dynamically and toggle display based on page
            const navMenu = document.querySelector('#navbar-placeholder ul.nav-menu');
            if (navMenu) {
                // Check if Hem link already exists
                let homeLink = document.getElementById("home-link");
                if (!homeLink) {
                    homeLink = document.createElement('li');
                    homeLink.innerHTML = `<a id="home-link" href="${basePrefix}/index.html" class="nav-link">Hem</a>`;
                    navMenu.insertBefore(homeLink, navMenu.firstChild);
                }

                if (isIndex) {
                    homeLink.style.display = "none";
                } else {
                    homeLink.style.display = "block";
                }
            }

            // Mobile navigation toggle - now that navbar is loaded
            const navToggle = document.querySelector('#navbar-placeholder .nav-toggle');
            const navMenuToggle = document.querySelector('#navbar-placeholder .nav-menu');

            if (navToggle && navMenuToggle) {
                navToggle.addEventListener('click', function() {
                    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                    navToggle.setAttribute('aria-expanded', !isExpanded);
                    navMenuToggle.classList.toggle('active');
                });

                // Close mobile menu when clicking on a link
                const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        navToggle.setAttribute('aria-expanded', 'false');
                        navMenuToggle.classList.remove('active');
                    });
                });
            }
        });
});


// Load footer component
document.addEventListener("DOMContentLoaded", () => {
    let path = "";

    // Check if we are inside folder /1/
    if (window.location.pathname.includes("/1/")) {
        path = "footer.html";
    } else {
        path = "1/footer.html";
    }

    // GitHub Pages prefix
    let basePrefix = "";
    if (window.location.hostname.includes("github.io")) {
        basePrefix = "/lejonTKD";
    }

    // Load footer
    fetch(path)
        .then(response => response.text())
        .then(data => {
            // Fix absolute href/src paths so they work on GitHub Pages
            const adjustedData = data.replace(/(href|src)="\//g, `$1="${basePrefix}/`);

            document.getElementById("footer-placeholder").innerHTML = adjustedData;

            // Fix relative links if loading from root (prepend 1/)
            const isRoot = !window.location.pathname.includes("/1/");
            if (isRoot) {
                const links = document.querySelectorAll('#footer-placeholder a');
                links.forEach(link => {
                    const href = link.getAttribute('href');

                    if (
                        href &&
                        !href.startsWith("http") &&
                        !href.startsWith("mailto:") &&
                        !href.startsWith("#")
                    ) {
                        if (!href.startsWith('1/')) {
                            link.href = `${basePrefix}/1/${href}`;
                        } else {
                            link.href = `${basePrefix}/${href}`;
                        }
                    }
                });
            }
        })
        .catch(error => console.log("Footer loading error:", error));
});


// Lazy loading
document.addEventListener("DOMContentLoaded", function() {
  const lazyImages = document.querySelectorAll(".lazy");
  const options = { rootMargin: "0px 0px 50px 0px", threshold: 0 };
  
  const lazyLoad = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  }, options);
  
  lazyImages.forEach(img => lazyLoad.observe(img));
});

// Gallery System with Random Selection and Modal
document.addEventListener('DOMContentLoaded', function() {
    // All available gallery images (excluding logos, videos, and non-displayable formats)
    const allGalleryImages = [
        '1/images/482209172_9364902986926563_5916584812675029144_n.jpg',
        '1/images/483735717_9358447500905445_6877543920309236774_n.jpg',
        '1/images/487543765_9467208896695971_8944467126548948374_n.jpg',
        '1/images/487674476_9467202060029988_4815281988279844292_n.jpg',
        '1/images/489041866_9520107234739470_2961360016254588005_n.jpg',
        '1/images/490855416_9570495323033994_5315674643087459799_n.jpg',
        '1/images/490916081_9562715080478685_3297657162050413043_n.jpg',
        '1/images/491964974_9623052441111615_6977924920370143104_n.jpg',
        '1/images/513651603_23894520133538274_5640907701813658302_n.jpg',
        '1/images/513780330_23894519890204965_6951999527634970080_n.jpg',
        '1/images/514271693_23893602583630029_530679452399934868_n.jpg',
        '1/images/540419627_24413309771659305_470074930240162789_n.jpg',
        '1/images/593543667_25240798478910426_305354356074607486_n.jpg',
        '1/images/advancednew.jpg',
        '1/images/allaalder.jpg',
        '1/images/elite.jpg',
        '1/images/gemenskap.jpg',
        '1/images/IMG_0477.jpg',
        '1/images/IMG_5161.jpg',
        '1/images/IMG_6129.jpg',
        '1/images/IMG_6374.PNG',
        '1/images/IMG_7552.jpg',
        '1/images/IMG_7963.JPG',
        '1/images/IMG_9214.jpg',
        '1/images/mainPic2.jpg',
        '1/images/mainPic3.jpg',
        '1/images/mainPic4.jpg',
        '1/images/mainPic5.jpg',
        '1/images/vinst.jpg'
    ];

    // Function to shuffle array (Fisher-Yates algorithm) - ensures no duplicates
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Function to populate main gallery with 8 unique random images
    function populateMainGallery() {
        const mainGallery = document.getElementById('main-gallery');
        if (!mainGallery) return;

        // Shuffle and select 8 unique images (no duplicates possible with slice)
        const shuffledImages = shuffleArray(allGalleryImages);
        const selectedImages = shuffledImages.slice(0, 8);

        mainGallery.innerHTML = '';
        selectedImages.forEach((imagePath, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `<img src="${imagePath}" alt="Bild från Lion Taekwondo IF" loading="lazy">`;
            mainGallery.appendChild(galleryItem);
        });

        // Add click handlers for lightbox
        attachLightboxHandlers();
    }

    // Function to populate modal gallery with all images
    function populateModalGallery() {
        const modalGallery = document.getElementById('modal-gallery');
        if (!modalGallery) return;

        modalGallery.innerHTML = '';
        allGalleryImages.forEach((imagePath, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'modal-gallery-item';
            galleryItem.innerHTML = `<img src="${imagePath}" alt="Bild från Lion Taekwondo IF" loading="lazy">`;
            modalGallery.appendChild(galleryItem);
        });

        // Add click handlers for lightbox
        attachModalLightboxHandlers();
    }

    // Lightbox functionality
    let currentImageIndex = 0;
    let currentImageArray = [];

    function openLightbox(imageSrc, imageArray) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxCounter = document.getElementById('lightbox-counter');

        currentImageArray = imageArray;
        currentImageIndex = imageArray.indexOf(imageSrc);

        lightbox.classList.add('active');
        lightboxImg.src = imageSrc;
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${imageArray.length}`;
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        if (currentImageArray.length === 0) return;

        if (direction === 'next') {
            currentImageIndex = (currentImageIndex + 1) % currentImageArray.length;
        } else {
            currentImageIndex = (currentImageIndex - 1 + currentImageArray.length) % currentImageArray.length;
        }

        const lightboxImg = document.querySelector('.lightbox-img');
        const lightboxCounter = document.getElementById('lightbox-counter');
        lightboxImg.src = currentImageArray[currentImageIndex];
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImageArray.length}`;
    }

    function attachLightboxHandlers() {
        const galleryItems = document.querySelectorAll('#main-gallery .gallery-item img');
        const imageArray = Array.from(galleryItems).map(img => img.src);

        galleryItems.forEach(img => {
            img.addEventListener('click', () => {
                openLightbox(img.src, imageArray);
            });
        });
    }

    function attachModalLightboxHandlers() {
        const modalGalleryItems = document.querySelectorAll('#modal-gallery .modal-gallery-item img');
        const imageArray = Array.from(modalGalleryItems).map(img => img.src);

        modalGalleryItems.forEach(img => {
            img.addEventListener('click', () => {
                openLightbox(img.src, imageArray);
            });
        });
    }

    // Modal functionality
    const viewAllBtn = document.getElementById('view-all-btn');
    const galleryModal = document.getElementById('gallery-modal');
    const modalClose = document.querySelector('.modal-close');

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Create and show back to top button when modal opens
            const backToTopBtn = document.getElementById('back-to-top') || createBackToTopButton();
            // Show it immediately
            setTimeout(() => {
                backToTopBtn.classList.add('visible');
            }, 100);
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            closeModal();
        });
    }

    // Close modal when clicking outside
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeModal();
            }
        });
    }

    function closeModal() {
        galleryModal.classList.remove('active');
        document.body.style.overflow = '';
        // Hide back to top button when modal closes
        hideBackToTopButton();
    }

    // Back to Top Button functionality
    function createBackToTopButton() {
        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Tillbaka till toppen');
        backToTopBtn.setAttribute('role', 'button');
        backToTopBtn.setAttribute('tabindex', '0');
        document.body.appendChild(backToTopBtn);

        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Keyboard accessibility
        backToTopBtn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });

        return backToTopBtn;
    }

    function scrollToTop() {
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal && galleryModal.classList.contains('active')) {
            // Scroll modal to top
            galleryModal.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    function showBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top') || createBackToTopButton();
        backToTopBtn.classList.add('visible');
    }

    function hideBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            backToTopBtn.classList.remove('visible');
        }
    }

    // Show/hide back to top button based on scroll position in modal
    if (galleryModal) {
        galleryModal.addEventListener('scroll', () => {
            const backToTopBtn = document.getElementById('back-to-top');
            if (galleryModal.classList.contains('active') && backToTopBtn) {
                if (galleryModal.scrollTop > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        });
    }

    // Lightbox controls
    const lightboxClose = document.querySelector('.lightbox .close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    }

    // Close lightbox when clicking outside image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }

        // Close modal with Escape key
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal && galleryModal.classList.contains('active') && e.key === 'Escape') {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
            hideBackToTopButton();
        }
    });

    // Initialize galleries
    populateMainGallery();
    populateModalGallery();
});
