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

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const galleryItems = document.querySelectorAll('.gallery-item img');
const closeBtn = document.querySelector('.lightbox .close');

galleryItems.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

// Klick utanför bilden stänger lightbox
lightbox.addEventListener('click', (e) => {
  if(e.target === lightbox) lightbox.style.display = 'none';
});
