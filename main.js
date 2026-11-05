/* ==========================================================================
   SAHIL DIGITAL MARKETING - ADVANCED MOTION GRAPHICS ENGINE
   - 3D Interactive Three.js Particle Mesh & Chrome Objects
   - 3D Gyroscopic Card Tilt on Mouse Move
   - GSAP ScrollTrigger Entrance Animations
   - Kinetic Counter Acceleration
   - Smooth Interactive Micro-Animations
   ========================================================================== */

// 1. THREE.JS 3D SCENE & AMBIENT MOTION GRAPHICS
(function init3DScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020614, 0.0011);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 850;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting System: Metallic Silver & Electric Blue
  const ambientLight = new THREE.AmbientLight(0x0a1936, 1.3);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xe2e8f0, 1.9);
  keyLight.position.set(200, 400, 500);
  scene.add(keyLight);

  const fillBlueLight = new THREE.DirectionalLight(0x0ea5e9, 1.4);
  fillBlueLight.position.set(-300, -200, 300);
  scene.add(fillBlueLight);

  // 2,400 Blue & Silver Glowing Particles
  const particleCount = 2400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const silverWhite = new THREE.Color(0xf8fafc);
  const chromeGrey = new THREE.Color(0x94a3b8);
  const electricBlue = new THREE.Color(0x0ea5e9);
  const iceBlue = new THREE.Color(0x38bdf8);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2600;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1900;

    const r = Math.random();
    let c = silverWhite;
    if (r > 0.70) c = electricBlue;
    else if (r > 0.45) c = iceBlue;
    else if (r > 0.25) c = chromeGrey;

    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.25, 'rgba(226,232,240,0.85)');
    gradient.addColorStop(0.55, 'rgba(14,165,233,0.35)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 5.5,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Metallic Chrome 3D Geometric Group
  const metallicGroup = new THREE.Group();

  const ringGeo1 = new THREE.TorusGeometry(320, 1.4, 20, 120);
  const chromeMat1 = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.18,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const torus1 = new THREE.Mesh(ringGeo1, chromeMat1);
  metallicGroup.add(torus1);

  const ringGeo2 = new THREE.TorusGeometry(250, 1.0, 16, 100);
  const chromeMat2 = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.95,
    roughness: 0.22,
    wireframe: true,
    transparent: true,
    opacity: 0.28
  });
  const torus2 = new THREE.Mesh(ringGeo2, chromeMat2);
  torus2.rotation.x = Math.PI / 3;
  metallicGroup.add(torus2);

  const icoGeo = new THREE.IcosahedronGeometry(180, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.25,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  metallicGroup.add(icosahedron);

  metallicGroup.position.set(380, 40, -100);
  scene.add(metallicGroup);

  // Mouse Follow & Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

    const ambientGlow = document.getElementById('ambient-glow');
    if (ambientGlow) {
      ambientGlow.style.left = `${event.clientX}px`;
      ambientGlow.style.top = `${event.clientY}px`;
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.22;
    targetY = mouseY * 0.22;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    particleSystem.rotation.y = elapsedTime * 0.032;
    particleSystem.rotation.x = elapsedTime * 0.014;

    metallicGroup.rotation.x = elapsedTime * 0.1;
    metallicGroup.rotation.y = elapsedTime * 0.15;
    metallicGroup.rotation.z = Math.sin(elapsedTime * 0.18) * 0.18;

    torus1.rotation.z = elapsedTime * 0.09;
    torus2.rotation.y = -elapsedTime * 0.13;
    icosahedron.rotation.x = elapsedTime * 0.16;

    const scrollY = window.scrollY || window.pageYOffset;
    metallicGroup.position.y = 40 - (scrollY * 0.24);
    metallicGroup.position.x = 380 - (scrollY * 0.09);

    renderer.render(scene, camera);
  }

  animate();
})();

// 2. 3D GYROSCOPIC TILT PHYSICS (Services & Hero Cards)
function initTiltEffects() {
  const tiltElements = document.querySelectorAll('.service-card, .hero-logo-frame, .why-card');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

// 3. GSAP SCROLL ENTRANCE & MOTION GRAPHICS
function initMotionGraphics() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Staggered Entrance
  gsap.from('.hero-brand-badge', { opacity: 0, y: -30, duration: 1, ease: 'power3.out' });
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1.1, delay: 0.2, ease: 'power4.out' });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: 'power3.out' });
  gsap.from('.hero-buttons .btn', { opacity: 0, y: 30, duration: 0.9, delay: 0.6, stagger: 0.15, ease: 'back.out(1.7)' });
  gsap.from('.hero-metrics .metric-item', { opacity: 0, scale: 0.8, duration: 0.8, delay: 0.8, stagger: 0.2, ease: 'power2.out' });
  gsap.from('.hero-visual-card', { opacity: 0, scale: 0.85, duration: 1.3, delay: 0.3, ease: 'power3.out' });

  // ScrollTrigger Animations for Sections
  if (typeof ScrollTrigger !== 'undefined') {
    // Services Stagger Entrance
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 1,
      ease: 'power3.out'
    });

    // Why Choose Us Stagger
    gsap.from('.why-card', {
      scrollTrigger: {
        trigger: '.why-us-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out'
    });

    // Portfolio Items Reveal
    gsap.from('.portfolio-item', {
      scrollTrigger: {
        trigger: '.portfolio-section',
        start: 'top 80%',
      },
      opacity: 0,
      scale: 0.9,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power2.out'
    });
  }

  // Kinetic Metric Counter Animation
  const counters = document.querySelectorAll('.metric-number');
  counters.forEach(counter => {
    const text = counter.innerText;
    if (text.includes('%')) {
      const val = parseInt(text);
      gsap.from({ val: 0 }, {
        val: val,
        duration: 2.2,
        delay: 0.8,
        ease: 'power2.out',
        onUpdate: function() {
          counter.innerText = Math.floor(this.targets()[0].val) + '%';
        }
      });
    } else if (text.includes('x')) {
      gsap.from({ val: 1.0 }, {
        val: 4.8,
        duration: 2.4,
        delay: 0.9,
        ease: 'power2.out',
        onUpdate: function() {
          counter.innerText = this.targets()[0].val.toFixed(1) + 'x';
        }
      });
    }
  });
}

// 4. UI INTERACTIONS & MODALS
document.addEventListener('DOMContentLoaded', () => {
  initTiltEffects();
  initMotionGraphics();

  // Header scroll state
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Service modal
  const serviceDetails = {
    smm: {
      title: "Social Media Marketing",
      subtitle: "Omnichannel brand engagement, viral storytelling & paid social scale",
      icon: "fa-bullhorn",
      desc: "Our social media strategies combine algorithmic precision with cinematic creative direction. We manage, grow, and optimize brand footprints across Instagram, LinkedIn, YouTube, X, and Facebook.",
      points: [
        "Tailored high-converting creative ad funnels & video reels",
        "Targeted audience segmentation and demographic clustering",
        "Influencer partnerships and brand ambassador acceleration",
        "Community management with 24/7 proactive sentiment monitoring"
      ],
      metric: "+320% Average Audience Engagement Surge"
    },
    seo: {
      title: "SEO (Search Engine Optimization)",
      subtitle: "Dominating organic search results and AI discovery indices",
      icon: "fa-magnifying-glass",
      desc: "We engineer SEO frameworks built for Google algorithms and Generative Search Engines (SGE). Our technical, content, and backlink architectures ensure you secure permanent top positions.",
      points: [
        "Core Web Vitals acceleration & technical SEO architectural audit",
        "Intent-driven high-converting commercial keyword targeting",
        "Topical authority building through comprehensive content clusters",
        "High-domain authority authoritative editorial backlink outreach"
      ],
      metric: "#1 Rankings for high-intent competitive keywords"
    },
    gads: {
      title: "Google Ads & PPC Performance",
      subtitle: "Maximum return on ad spend (ROAS) via high-precision bidding",
      icon: "fa-shapes",
      desc: "Every advertising dollar yields verifiable growth. We formulate surgical Search, Performance Max, Display, and YouTube remarketing funnels with real-time bidding optimization.",
      points: [
        "Advanced intent match structures & continuous negative keyword pruning",
        "Dynamic remarketing loops targeting high-value abandoners",
        "High-converting landing page optimization and CRO integration",
        "Transparent multi-touch attribution dashboards"
      ],
      metric: "4.8x Average Return on Ad Spend (ROAS)"
    },
    content: {
      title: "Content Marketing",
      subtitle: "Engaging editorial, visual storytelling and brand conversion copy",
      icon: "fa-file-lines",
      desc: "Content is the bedrock of credibility. We produce authoritative industry thought-leadership pieces, interactive visual guides, compelling copywriting, and brand narratives that capture mindshare.",
      points: [
        "Brand tone-of-voice design and narrative styleguides",
        "Long-form SEO pillar guides, case studies and whitepapers",
        "Email marketing sequences and high-converting automation workflows",
        "Creative copywriting for digital ads and high-converting landing pages"
      ],
      metric: "+180% Organic Inbound Lead Generation"
    },
    analytics: {
      title: "Analytics & Performance Analysis",
      subtitle: "Transforming raw user metrics into decisive growth strategies",
      icon: "fa-chart-simple",
      desc: "Growth without data is mere guesswork. We implement enterprise tracking frameworks (GA4, server-side tagging, custom BI dashboards) to track full-funnel customer journeys and lifetime value.",
      points: [
        "GA4 custom event instrumentation & server-side Tag Manager setup",
        "Full-funnel conversion attribution and revenue cohort analytics",
        "Predictive customer churn and lifetime value (LTV) modelling",
        "Live interactive executive KPI dashboards with automated alerts"
      ],
      metric: "100% Data-driven visibility across marketing channels"
    }
  };

  const modalOverlay = document.getElementById('service-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body-content');

  document.querySelectorAll('.open-service-modal').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = button.getAttribute('data-service');
      const data = serviceDetails[serviceKey];
      if (!data) return;

      modalBody.innerHTML = `
        <div style="display:flex; align-items:center; gap: 1.25rem; margin-bottom: 1.5rem;">
          <div style="width: 60px; height: 60px; border-radius: 16px; background: rgba(14,165,233,0.12); border: 1px solid rgba(148,163,184,0.3); display:flex; align-items:center; justify-content:center; font-size: 1.8rem; color: #ffffff;">
            <i class="fa-solid ${data.icon}"></i>
          </div>
          <div>
            <h3 style="font-size: 1.6rem; color: #fff; margin-bottom: 0.2rem;">${data.title}</h3>
            <p style="color: var(--silver-mid); font-size: 0.88rem; font-weight: 500;">${data.subtitle}</p>
          </div>
        </div>
        <p style="color: var(--silver-grey); line-height: 1.7; font-size: 1rem; margin-bottom: 1.5rem;">${data.desc}</p>
        <div style="background: rgba(4, 12, 34, 0.7); border: 1px solid rgba(148,163,184,0.22); border-radius: 14px; padding: 1.25rem; margin-bottom: 1.5rem;">
          <h5 style="color: #fff; font-size: 0.95rem; margin-bottom: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Execution Architecture:</h5>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
            ${data.points.map(pt => `<li style="display: flex; align-items: start; gap: 0.6rem; color: var(--chrome-light); font-size: 0.92rem;"><i class="fa-solid fa-check" style="color: var(--cyan-glow); margin-top: 4px;"></i> <span>${pt}</span></li>`).join('')}
          </ul>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(14,165,233,0.08); border: 1px dashed rgba(148,163,184,0.3); padding: 1rem 1.4rem; border-radius: 12px;">
          <span style="font-size: 0.85rem; color: var(--silver-grey);">Proven Impact Metric:</span>
          <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">${data.metric}</span>
        </div>
        <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
          <a href="#contact" onclick="document.getElementById('service-modal').classList.remove('active')" class="btn btn-primary btn-glow">Request Strategy Session</a>
        </div>
      `;

      modalOverlay.classList.add('active');
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // Portfolio filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Transmitting...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        formStatus.classList.add('success');
        formStatus.innerHTML = `
          <strong><i class="fa-solid fa-circle-check"></i> Strategy Request Received!</strong><br>
          Thank you for reaching out to SAHIL Digital Marketing. A senior digital strategist will contact you within 2 hours.
        `;
        contactForm.reset();

        setTimeout(() => {
          formStatus.classList.remove('success');
        }, 8000);
      }, 1200);
    });
  }

  // Scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  });
});
