/* ==========================================================================
   SAHIL DIGITAL MARKETING - ADVANCED MOTION GRAPHICS ENGINE
   - 3D Interactive Three.js Particle Mesh & Chrome Objects
   - 3D Gyroscopic Card Tilt on Mouse Move
   - GSAP ScrollTrigger Entrance Animations
   - Kinetic Counter Acceleration
   - Smooth Interactive Micro-Animations
   ========================================================================== */

// 1. THREE.JS 3D CINEMATIC BACKGROUND ENGINE
(function init3DScene() {
  const bgCanvas = document.getElementById('webgl-canvas');
  if (!bgCanvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020614, 0.00075);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    3000
  );
  camera.position.set(0, 220, 750);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas: bgCanvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x0a1936, 2.0);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x00d9ff, 2.8);
  mainLight.position.set(300, 600, 400);
  scene.add(mainLight);

  const backLight = new THREE.DirectionalLight(0x008cff, 2.0);
  backLight.position.set(-300, -200, -200);
  scene.add(backLight);

  // --- 1. A BEAUTIFUL 3D UNDULATING CYBER WAVE MATRIX (Points) ---
  const waveWidth = 2400;
  const waveDepth = 2000;
  const cols = 90;
  const rows = 80;
  const totalWavePoints = cols * rows;

  const waveGeometry = new THREE.BufferGeometry();
  const wavePositions = new Float32Array(totalWavePoints * 3);
  const waveColors = new Float32Array(totalWavePoints * 3);

  const colorCyan = new THREE.Color(0x00d9ff);
  const colorBlue = new THREE.Color(0x0066ff);
  const colorSilver = new THREE.Color(0xe2e8f0);

  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = c / (cols - 1);
      const v = r / (rows - 1);
      const x = (u - 0.5) * waveWidth;
      const z = (v - 0.5) * waveDepth - 100;
      const y = -180;

      wavePositions[idx * 3] = x;
      wavePositions[idx * 3 + 1] = y;
      wavePositions[idx * 3 + 2] = z;

      // Color gradient across the wave
      const mixCol = colorCyan.clone().lerp(colorBlue, Math.sin(u * Math.PI) * 0.7);
      if (r % 7 === 0) mixCol.lerp(colorSilver, 0.4);

      waveColors[idx * 3] = mixCol.r;
      waveColors[idx * 3 + 1] = mixCol.g;
      waveColors[idx * 3 + 2] = mixCol.b;

      idx++;
    }
  }

  waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
  waveGeometry.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

  function createGlowDotTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(0,217,255,0.9)');
    grad.addColorStop(0.6, 'rgba(0,110,255,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.Texture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const glowTexture = createGlowDotTexture();

  const waveMaterial = new THREE.PointsMaterial({
    size: 7.5,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
  scene.add(wavePoints);

  // --- 2. FLOATING CELESTIAL STARDUST PARTICLES ---
  const starCount = 1400;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starCols = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 2600;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 1600 + 100;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 2200;

    const rnd = Math.random();
    let col = colorCyan;
    if (rnd > 0.6) col = colorSilver;
    else if (rnd > 0.3) col = colorBlue;

    starCols[i * 3] = col.r;
    starCols[i * 3 + 1] = col.g;
    starCols[i * 3 + 2] = col.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

  const starMaterial = new THREE.PointsMaterial({
    size: 5.5,
    vertexColors: true,
    map: glowTexture,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starPoints = new THREE.Points(starGeo, starMaterial);
  scene.add(starPoints);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 0;
  let targetCamY = 220;
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

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Smooth Interactive Camera Parallax
    targetCamX = mouseX * 0.35;
    targetCamY = 220 + (-mouseY * 0.25);
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, -60, 0);

    // Dynamic Harmonic 3D Wave Calculation
    const posAttr = waveGeometry.attributes.position;
    const array = posAttr.array;
    let pIndex = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const u = c / cols;
        const v = r / rows;

        // Multiple overlapping sine harmonics for organic water/silk wave motion
        const wave1 = Math.sin(u * 7.0 + time * 1.5) * 45;
        const wave2 = Math.cos(v * 6.0 + time * 1.2) * 35;
        const wave3 = Math.sin((u + v) * 5.0 + time * 1.8) * 25;
        const ripple = Math.sin(Math.sqrt((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)) * 12.0 - time * 2.0) * 20;

        array[pIndex * 3 + 1] = -190 + wave1 + wave2 + wave3 + ripple;
        pIndex++;
      }
    }
    posAttr.needsUpdate = true;

    // Gentle starfield drift
    starPoints.rotation.y = time * 0.015;
    starPoints.rotation.x = Math.sin(time * 0.01) * 0.05;

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
  gsap.from('.hero-value-badges .value-badge-item', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, stagger: 0.15, ease: 'power2.out' });
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

  // Motion graphics setup complete
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
      subtitle: "Omnichannel brand engagement, creative storytelling & targeted outreach",
      icon: "fa-bullhorn",
      desc: "Our social media strategies combine strategic planning with creative direction. We manage, grow, and optimize brand presence across Instagram, LinkedIn, YouTube, X, and Facebook.",
      points: [
        "Tailored creative content and video reels aligned with your brand",
        "Targeted audience segmentation and demographic focus",
        "Influencer partnerships and community outreach",
        "Proactive page management and active engagement monitoring"
      ],
      deliverable: "Custom Content Calendar & Monthly Growth Reports"
    },
    seo: {
      title: "SEO (Search Engine Optimization)",
      subtitle: "Building long-term organic search presence and keyword visibility",
      icon: "fa-magnifying-glass",
      desc: "We build structured SEO foundations for search engines and modern discovery algorithms. Our technical, on-page, and content structure helps your business get found by customers searching for your services.",
      points: [
        "Technical site audit and Core Web Vitals performance review",
        "Intent-driven commercial keyword research and placement",
        "Topical content structuring for improved search indexing",
        "High-quality local and industry-relevant backlink development"
      ],
      deliverable: "On-Page Optimization & Ranking Progress Tracking"
    },
    gads: {
      title: "Google Ads & PPC Campaigns",
      subtitle: "Targeted advertising engineered to reach high-intent customers",
      icon: "fa-shapes",
      desc: "Every advertising campaign is built with deliberate targeting. We design Search, Display, and Performance campaigns focused on connecting with prospects ready to engage with your business.",
      points: [
        "Keyword research, search intent matching, and negative keyword optimization",
        "Targeted remarketing campaigns to re-engage interested visitors",
        "Ad copy creation and dedicated landing page alignment",
        "Clear tracking dashboards for conversion monitoring"
      ],
      deliverable: "Full Campaign Setup, Ad Copy & Live Analytics Dashboard"
    },
    content: {
      title: "Content Marketing",
      subtitle: "Informative articles, engaging copy, and digital brand collateral",
      icon: "fa-file-lines",
      desc: "Good content creates credibility. We produce clear, engaging copywriting, visual guides, and brand narratives that clearly explain your offerings and build customer trust.",
      points: [
        "Brand tone-of-voice alignment and messaging guidelines",
        "Informative articles, service overviews, and product explainers",
        "Email newsletters and client communication sequences",
        "Persuasive copy for digital ads and landing pages"
      ],
      deliverable: "Professional Brand Copywriting & Content Assets"
    },
    analytics: {
      title: "Analytics & Performance Reporting",
      subtitle: "Clear visibility into website visitors and marketing performance",
      icon: "fa-chart-simple",
      desc: "Marketing decisions should be backed by clear insights. We set up Google Analytics (GA4) and transparent reports so you always know where your visitors come from and how they interact with your brand.",
      points: [
        "Google Analytics 4 (GA4) and Google Tag Manager installation",
        "Lead generation and goal completion event tracking",
        "Traffic source attribution to understand which channels work best",
        "Easy-to-read executive performance summaries"
      ],
      deliverable: "Clean Analytics Configuration & Scheduled Reports"
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
          <span style="font-size: 0.85rem; color: var(--silver-grey);">Included Deliverables:</span>
          <span style="font-weight: 700; color: #fff; font-size: 0.95rem;">${data.deliverable}</span>
        </div>
        <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
          <a href="#contact" onclick="document.getElementById('service-modal').classList.remove('active')" class="btn btn-primary btn-glow">Get a Proposal</a>
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

  // ==========================================================================
  // FIELD NOTES / INSIGHTS DATA (From Reference tiiny.site)
  // ==========================================================================
  const POSTS = [
    {
      c: "Social Media",
      date: "01 / BRAND COMMUNITY",
      read: "4 MIN READ",
      t: "Your audience is not a number. It is a community.",
      x: "Turn passive followers into people who recognise, trust and choose your brand.",
      kind: "social",
      label: "CONNECTION OVER CONTENT",
      body: "Strong social media is not about posting every day just to stay visible. It is about giving the right people a reason to care. Start with a clear point of view, create repeatable content themes, respond like a human and use saves, shares, meaningful replies and enquiries to understand what is resonating. Build a community before chasing a bigger number."
    },
    {
      c: "SEO",
      date: "02 / SEARCH STRATEGY",
      read: "5 MIN READ",
      t: "Search visibility starts before the first click.",
      x: "A useful SEO foundation connects search intent, helpful pages and a clear user journey.",
      kind: "seo",
      label: "BE THE RIGHT ANSWER",
      body: "SEO works best when you understand what a person is trying to solve. Group keywords by intent, make each important page answer one clear need, improve page speed and internal links, and publish genuinely useful information. Rankings matter, but the real goal is to help the right visitor take the next step."
    },
    {
      c: "Google Ads",
      date: "03 / PAID PERFORMANCE",
      read: "3 MIN READ",
      t: "Clicks are easy. The right conversions take a plan.",
      x: "Make every campaign decision connect to the outcome your business actually needs.",
      kind: "ads",
      label: "MAKE EVERY CLICK COUNT",
      body: "Before increasing ad spend, check the foundations: a specific audience, focused keywords, compelling creative, a relevant landing page and conversion tracking that works. Review search terms regularly and separate high-intent traffic from curiosity clicks. Optimise towards qualified enquiries or sales—not clicks alone."
    },
    {
      c: "Content",
      date: "04 / CREATIVE THINKING",
      read: "4 MIN READ",
      t: "A good content strategy gives every story a job.",
      x: "Create a consistent voice across reels, blogs, campaigns and everyday conversations.",
      kind: "content",
      label: "STORIES WITH PURPOSE",
      body: "Useful content should educate, build trust or help someone make a decision. Choose a few content pillars, adapt the message to each platform and keep the brand voice recognisable. A single strong idea can become a short video, carousel, blog article and email—without simply copying the same format everywhere."
    },
    {
      c: "Analysis",
      date: "05 / DATA & DECISIONS",
      read: "4 MIN READ",
      t: "Measure what moves the business—not just what looks good.",
      x: "Turn campaign reports into clear decisions, sharper experiments and better next steps.",
      kind: "analysis",
      label: "INSIGHT INTO ACTION",
      body: "A useful report connects activity to outcomes. Look beyond reach and impressions: examine qualified leads, conversion rate, cost per acquisition, return on ad spend and the journey between them. Compare performance over time, note what changed and choose one practical experiment for the next cycle. Data is valuable when it changes a decision."
    }
  ];

  function getInsightArtIcon(kind) {
    switch (kind) {
      case 'social': return '<i class="fa-solid fa-users" style="font-size: 3rem; color: var(--cyan-glow);"></i>';
      case 'seo': return '<i class="fa-solid fa-magnifying-glass-chart" style="font-size: 3rem; color: var(--electric-blue);"></i>';
      case 'ads': return '<i class="fa-solid fa-bullseye" style="font-size: 3rem; color: var(--cyan-glow);"></i>';
      case 'content': return '<i class="fa-solid fa-feather-pointed" style="font-size: 3rem; color: var(--silver-light);"></i>';
      case 'analysis': return '<i class="fa-solid fa-chart-line" style="font-size: 3rem; color: var(--cyan-glow);"></i>';
      default: return '<i class="fa-solid fa-lightbulb" style="font-size: 3rem; color: var(--cyan-glow);"></i>';
    }
  }

  const insightsGrid = document.getElementById('insights-grid');
  function renderInsights(filter) {
    if (!insightsGrid) return;
    const list = POSTS.map((p, i) => ({ p, i })).filter(item => filter === 'all' || item.p.c === filter);

    insightsGrid.innerHTML = list.map(item => {
      const p = item.p;
      return `
        <article class="insight-card shimmer-edge">
          <div class="insight-art" aria-hidden="true">
            <span class="art-index">FIELD NOTE / 0${item.i + 1}</span>
            <div style="display:flex; align-items:center; justify-content:center; width: 100%; height: 100%;">
              ${getInsightArtIcon(p.kind)}
            </div>
            <span class="art-label">${p.label}</span>
            <span class="art-corner">SAHIL&reg; / JOURNAL</span>
          </div>
          <div class="insight-card-copy">
            <div class="insight-meta">
              <span><i class="fa-solid fa-circle" style="font-size: 0.45rem; margin-right: 6px;"></i>${p.c}</span>
              <span>${p.read}</span>
            </div>
            <small class="insight-date">${p.date}</small>
            <h3>${p.t}</h3>
            <p>${p.x}</p>
            <button class="insight-read" type="button" data-post="${item.i}">
              <span>EXPLORE THE IDEA</span>
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
          </div>
          <span class="insight-card-number">0${item.i + 1}</span>
        </article>
      `;
    }).join('');

    // Attach click listeners to "EXPLORE THE IDEA" buttons
    document.querySelectorAll('.insight-read').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const postIndex = Number(btn.getAttribute('data-post'));
        const postData = POSTS[postIndex];
        if (!postData) return;

        const modal = document.getElementById('insight-modal');
        document.getElementById('modal-topic').textContent = `${postData.c}  /  ${postData.read}`;
        document.getElementById('modal-title').textContent = postData.t;
        document.getElementById('modal-summary').textContent = postData.x;
        document.getElementById('modal-body').textContent = postData.body;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  renderInsights('all');

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.insight-filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderInsights(filter);
    });
  });

  // Modal close handlers
  const insightModal = document.getElementById('insight-modal');
  const insightModalClose = document.getElementById('insight-modal-close');
  const insightBackdrop = document.getElementById('insight-modal-backdrop');
  const modalCtaBtn = document.getElementById('modal-cta-btn');

  function closeInsightModal() {
    if (!insightModal) return;
    insightModal.classList.remove('open');
    insightModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (insightModalClose) insightModalClose.addEventListener('click', closeInsightModal);
  if (insightBackdrop) insightBackdrop.addEventListener('click', closeInsightModal);
  if (modalCtaBtn) modalCtaBtn.addEventListener('click', closeInsightModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && insightModal && insightModal.classList.contains('open')) {
      closeInsightModal();
    }
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
