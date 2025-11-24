// main.js - General functionality for the website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });
    }
    
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

            // Fix logo link href if on inside 1/ folder
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

            // AFTER navbar is loaded, run this:
            const homeLink = document.getElementById("home-link");

            if (isIndex && homeLink) {
                homeLink.style.display = "none";
            }
        });
});
