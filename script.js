// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 900,
  once: true,
  easing: 'ease-out-quart',
  offset: 100,
});

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('header.hero');
  const mainContentWrapper = document.querySelector('.main-content-wrapper');

  function stickyHeader() {
    if (window.scrollY > header.offsetTop + 150) {
      header.classList.add('header-sticky');
    } else {
      header.classList.remove('header-sticky');
    }
  }
  window.addEventListener('scroll', stickyHeader);
  stickyHeader();

  const themeToggle = document.getElementById('theme-toggle');
  function applyTheme(theme, initializeParticles = false) {
    let particleConfigPath = 'particles-config-default.json';
    let particlePrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color-light').trim().replace(/"/g, '');
    let particleLineColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-line-color-light').trim().replace(/"/g, '');

    if (theme === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      particleConfigPath = 'particles-config-dark.json';
      particlePrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-color-dark').trim().replace(/"/g, ''); // This should be #ffffff from CSS for dark bg particles
      particleLineColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-line-color-dark').trim().replace(/"/g, '');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    if (initializeParticles && typeof particlesJS !== 'undefined' && window.innerWidth > 768) {
        initAllParticles(particleConfigPath, particlePrimaryColor, particleLineColor);
    }
  }

  const savedTheme = localStorage.getItem('portfolioTheme') || 'light';
  applyTheme(savedTheme, true);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
      applyTheme(newTheme, true);
      localStorage.setItem('portfolioTheme', newTheme);
      AOS.refresh();
    });
  }

  const menuToggleBtn = document.querySelector('.menu-toggle-btn');
  const navLinksContainer = document.querySelector('.nav-links');
  if (menuToggleBtn && navLinksContainer) {
    menuToggleBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = menuToggleBtn.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.classList.remove('fa-bars'); icon.classList.add('fa-times');
        menuToggleBtn.setAttribute('aria-expanded', 'true');
        body.style.overflowY = 'hidden';
      } else {
        icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
        menuToggleBtn.setAttribute('aria-expanded', 'false');
        body.style.overflowY = 'auto';
      }
    });
    navLinksContainer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinksContainer.classList.contains('active')) {
          navLinksContainer.classList.remove('active');
          const icon = menuToggleBtn.querySelector('i');
          icon.classList.remove('fa-times'); icon.classList.add('fa-bars');
          menuToggleBtn.setAttribute('aria-expanded', 'false');
          body.style.overflowY = 'auto';
        }
      });
    });
  }

  const sectionsForNav = document.querySelectorAll('.main-content-wrapper section[id], header.hero[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  function changeNavActiveState() {
    let currentSectionId = sectionsForNav[0].id;
    const scrollPosition = pageYOffset + window.innerHeight / 1.8;
    sectionsForNav.forEach(section => {
      if (scrollPosition >= section.offsetTop) {
        currentSectionId = section.getAttribute('id');
      }
    });
    navAnchors.forEach(anchor => {
      anchor.classList.remove('active');
      if (anchor.getAttribute('href') === `#${currentSectionId}`) {
        anchor.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', changeNavActiveState);
  changeNavActiveState();

  const skillItems = document.querySelectorAll('.skill-item');
  const skillObserverOptions = { root: null, threshold: 0.4, rootMargin: "0px 0px -50px 0px" };
  const skillObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBarSpan = entry.target.querySelector('.progress-bar span');
        if (progressBarSpan && !progressBarSpan.style.width) {
          progressBarSpan.style.width = progressBarSpan.dataset.progress;
        }
      }
    });
  };
  const skillsObserver = new IntersectionObserver(skillObserverCallback, skillObserverOptions);
  skillItems.forEach(item => skillsObserver.observe(item));

  function apply3DTilt(containerSelector, imageSelectorInContainer, maxRotate = 8, scale = 1.04, perspective = 1200) {
    const tiltContainers = document.querySelectorAll(containerSelector);
    tiltContainers.forEach(container => {
      const elementToTilt = container.querySelector(imageSelectorInContainer) || container;
      container.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 769) return;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateY = (x / (rect.width / 2)) * maxRotate * 0.85;
        const rotateX = -(y / (rect.height / 2)) * maxRotate * 0.85;
        elementToTilt.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
      });
      container.addEventListener('mouseleave', () => {
        if (window.innerWidth < 769) return;
        elementToTilt.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      });
    });
  }
  apply3DTilt('.hero-image', 'img', 8, 1.04, 1200);
  apply3DTilt('.about-image-container', 'img', 7, 1.03, 1000);
  apply3DTilt('.testimonial-card-container', '.testimonial-card', 6, 1.02, 1000);

  const sectionsFor3DScroll = document.querySelectorAll('.main-content-wrapper section');
  const sectionObserverOptions = { root: null, threshold: 0.2, rootMargin: "0px 0px -10% 0px" };
  const sectionObserverCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // entry.target.classList.remove('is-visible'); // Optional: reset for re-animation
      }
    });
  };
  if (window.innerWidth > 768) {
    const sectionScrollObserver = new IntersectionObserver(sectionObserverCallback, sectionObserverOptions);
    sectionsFor3DScroll.forEach(section => {
        section.classList.add('section-3d-animate');
        sectionScrollObserver.observe(section);
    });
  }

  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  const contactForm = document.getElementById('contactFormActual');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin" style="margin-left: 8px;"></i>';
      submitBtn.disabled = true;
      setTimeout(() => {
        alert('Message sent successfully! (This is a demo)');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        contactForm.reset();
      }, 1500);
    });
  }

  // --- Particles.js Initialization ---
  function initAllParticles(configPath, pColor, pLineColor) {
    const particleSections = document.querySelectorAll('[data-particles]');
    particleSections.forEach(section => {
        const particleId = section.id + '-particles-bg';
        let particleDiv = document.getElementById(particleId);

        // Clean up previous instance if exists
        if (window.pJSDom && window.pJSDom[particleId]) {
            window.pJSDom[particleId].pJS.fn.vendors.destroypJS();
            delete window.pJSDom[particleId];
        }
        if (particleDiv) {
            particleDiv.remove();
        }

        particleDiv = document.createElement('div');
        particleDiv.id = particleId;
        section.insertBefore(particleDiv, section.firstChild);
        
        fetch(configPath)
            .then(response => response.json())
            .then(config => {
                config.particles.color.value = pColor;
                if (config.particles.line_linked && config.particles.line_linked.enable) {
                    config.particles.line_linked.color = pLineColor;
                }

                if (window.innerWidth < 992 && window.innerWidth >= 769) { // Tablet
                    config.particles.number.value = Math.max(20, Math.floor(config.particles.number.value * 0.5)); // Reduce significantly
                    if (config.particles.line_linked && config.particles.line_linked.enable) {
                         config.particles.line_linked.distance = 80;
                         config.particles.line_linked.opacity = Math.max(0.1, config.particles.line_linked.opacity * 0.5);
                    }
                    config.particles.size.value = Math.max(1, config.particles.size.value * 0.7);
                }
                
                particlesJS(particleId, config);
            })
            .catch(error => console.error('Error loading particle config:', error, 'for', particleId));
    });
  }
});