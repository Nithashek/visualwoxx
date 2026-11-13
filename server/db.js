const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'visual_woxx.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize the 19 Relational Tables specified in Section 11 of the Architecture Prompt
function initializeDatabase() {
  db.exec(`
    -- 1. profiles
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'super_admin',
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. clients
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      organization TEXT,
      services_requested TEXT,
      project_history TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. services
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL,
      icon_name TEXT NOT NULL,
      deliverables TEXT NOT NULL,
      packages_json TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. inquiries
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      organization TEXT,
      services_json TEXT NOT NULL,
      project_title TEXT NOT NULL,
      project_description TEXT NOT NULL,
      event_date TEXT,
      preferred_appointment_date TEXT,
      preferred_appointment_time TEXT,
      budget_range TEXT,
      preferred_contact_method TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new_inquiry',
      client_id TEXT,
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );

    -- 5. appointments
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      inquiry_id TEXT,
      client_id TEXT,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      service_name TEXT,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new_inquiry',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE SET NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );

    -- 6. projects
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      client_id TEXT,
      client_name TEXT NOT NULL,
      description TEXT,
      services_json TEXT NOT NULL,
      assigned_team_json TEXT,
      assigned_freelancers_json TEXT,
      start_date TEXT,
      deadline TEXT,
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'planning',
      progress_pct INTEGER DEFAULT 0,
      internal_notes TEXT,
      deliverable_links_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    );

    -- 7. project_tasks
    CREATE TABLE IF NOT EXISTS project_tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      assigned_to TEXT,
      due_date TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 8. project_updates
    CREATE TABLE IF NOT EXISTS project_updates (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      update_type TEXT NOT NULL DEFAULT 'status_change',
      title TEXT NOT NULL,
      description TEXT,
      author_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 9. freelancer_applications
    CREATE TABLE IF NOT EXISTS freelancer_applications (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      location TEXT NOT NULL,
      primary_skill TEXT NOT NULL,
      additional_skills_json TEXT,
      experience_level TEXT NOT NULL,
      portfolio_url TEXT NOT NULL,
      instagram_url TEXT,
      linkedin_url TEXT,
      working_style TEXT NOT NULL,
      availability TEXT NOT NULL,
      introduction TEXT NOT NULL,
      resume_url TEXT,
      status TEXT NOT NULL DEFAULT 'new_application',
      internal_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 10. freelancers
    CREATE TABLE IF NOT EXISTS freelancers (
      id TEXT PRIMARY KEY,
      application_id TEXT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      primary_skill TEXT NOT NULL,
      skills_json TEXT,
      experience_level TEXT,
      portfolio_url TEXT,
      availability_status TEXT DEFAULT 'available',
      rating REAL DEFAULT 5.0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES freelancer_applications(id) ON DELETE SET NULL
    );

    -- 11. project_assignments
    CREATE TABLE IF NOT EXISTS project_assignments (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      member_or_freelancer_id TEXT NOT NULL,
      assignment_type TEXT NOT NULL,
      role_title TEXT NOT NULL,
      assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 12. portfolio_projects
    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      client_name TEXT,
      project_date TEXT,
      description TEXT NOT NULL,
      services_provided_json TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      video_url TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1,
      credits_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 13. portfolio_media
    CREATE TABLE IF NOT EXISTS portfolio_media (
      id TEXT PRIMARY KEY,
      portfolio_project_id TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      media_url TEXT NOT NULL,
      caption TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (portfolio_project_id) REFERENCES portfolio_projects(id) ON DELETE CASCADE
    );

    -- 14. team_members
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      bio TEXT NOT NULL,
      photo_url TEXT NOT NULL,
      email TEXT,
      social_links_json TEXT,
      joining_date TEXT,
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 15. team_positions
    CREATE TABLE IF NOT EXISTS team_positions (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 16. contact_messages
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      is_read INTEGER DEFAULT 0,
      internal_notes TEXT,
      response_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 17. notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 18. site_settings
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 19. activity_logs
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      action_type TEXT NOT NULL,
      description TEXT NOT NULL,
      user_name TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 20. client_reviews
    CREATE TABLE IF NOT EXISTS client_reviews (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      designation TEXT NOT NULL,
      company TEXT,
      quote TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      avatar_url TEXT,
      is_published INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Ensure only the single admin account is retained
  try {
    db.prepare("DELETE FROM profiles WHERE username IN ('operations', 'creative', 'recruiter')").run();
  } catch (e) {
    console.error('Error pruning extraneous profiles:', e);
  }

  // Safe schema migrations for customized admin fields
  const safeAddColumn = (table, colDef) => {
    try {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${colDef}`).run();
    } catch (e) {
      // Column already exists
    }
  };
  safeAddColumn('appointments', 'location TEXT');
  safeAddColumn('appointments', 'purpose TEXT');
  safeAddColumn('appointments', 'meeting_notes TEXT');
  safeAddColumn('projects', 'project_type TEXT');
  safeAddColumn('projects', 'total_cost REAL DEFAULT 0');
  safeAddColumn('projects', 'progress_stage TEXT DEFAULT "planning"');
  safeAddColumn('clients', 'active_project TEXT');

  // Seed reviews if not present
  try {
    const revCount = db.prepare('SELECT COUNT(*) as count FROM client_reviews').get().count;
    if (revCount === 0) {
      const insertRev = db.prepare(`
        INSERT INTO client_reviews (id, client_name, designation, company, quote, rating, avatar_url, is_published, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertRev.run('rev_1', 'Maya Patel', 'Event Director', 'Odyssey Events', 'The team captured our event beautifully and delivered polished edits ahead of schedule.', 5, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', 1, 1);
      insertRev.run('rev_2', 'Daniel Reyes', 'Brand Manager', 'Aura Labs', 'They brought our visual identity to life with thoughtful, consistent design across every touchpoint.', 5, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', 1, 2);
      insertRev.run('rev_3', 'Sofia Chen', 'Marketing Lead', 'Apex Automotive', 'Professional from the first brief to final delivery. The campaign visuals felt cohesive and memorable.', 5, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', 1, 3);
    }
  } catch (e) {
    console.error('Error seeding client reviews:', e);
  }

  seedInitialData();
}

function seedInitialData() {
  const profileCount = db.prepare('SELECT COUNT(*) as count FROM profiles').get().count;
  if (profileCount > 0) return; // already seeded

  console.log('Seeding initial production-grade data for Visual Woxx...');

  // 1. Seed Single Admin Profile
  const insertProfile = db.prepare(`
    INSERT INTO profiles (id, username, email, password_hash, full_name, role, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertProfile.run('prof_1', 'admin', 'admin@visualwoxx.com', 'admin123', 'Aravind Menon', 'super_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  // 2. Seed Site Settings
  const insertSetting = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
  const defaultSettings = {
    brand_name: 'Visual Woxx',
    tagline: 'CREATIVE STUDIO',
    hero_headline: 'WE TURN IDEAS INTO VISUAL EXPERIENCES.',
    hero_description: 'Visual Woxx is your creative partner for design, photography, videography, branding, and complete digital solutions. From the first idea to the final frame, we bring your vision to life.',
    company_description: 'We turn imagination into visuals that make an impact. From creative concepts to captivating content, Visual Woxx brings design, media, and storytelling together to make every vision impossible to ignore.',
    mission: 'Our mission is to transform ideas into impactful visual experiences by delivering innovative, high-quality, and accessible creative digital solutions. We aim to simplify the creative process for our clients by bringing diverse creative services together under one roof.',
    vision: 'Our vision is to become a trusted creative digital solutions brand known for innovation, quality, and originality, empowering businesses, individuals, and organizations to communicate their stories and build stronger visual identities.',
    contact_email: 'contact@visualwoxx.in',
    contact_phone: '+91 94969 39827',
    contact_address: 'Kerala, India',
    instagram_url: 'https://instagram.com/visualwoxx',
    linkedin_url: 'https://linkedin.com/company/visualwoxx',
    youtube_url: 'https://youtube.com/@visualwoxx',
    twitter_url: 'https://twitter.com/visualwoxx',
    behance_url: 'https://behance.net/visualwoxx',
    footer_text: '© 2026 Visual Woxx Digital Solutions. All rights reserved. Crafting visual legacy with passion and precision.',
    stats_mode: 'live',
    happy_customers_count: '4+',
    completed_projects_count: '3+',
    freelancers_count: '2+'
  };

  for (const [k, v] of Object.entries(defaultSettings)) {
    insertSetting.run(k, v);
  }

  // 3. Seed 12 Complete Services
  const insertService = db.prepare(`
    INSERT INTO services (id, title, slug, short_desc, full_desc, icon_name, deliverables, packages_json, image_url, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const servicesData = [
    {
      id: 'srv_1',
      title: 'Graphic Design',
      slug: 'graphic-design',
      short_desc: 'Bespoke brand identities, typography-driven collateral, and print-ready visuals that demand attention.',
      full_desc: 'We engineer visually distinct identities and creative graphic solutions that communicate brand personality and captivate viewers. From comprehensive vector assets to print layouts, our design practice fuses modern aesthetics with functional clarity.',
      icon_name: 'Palette',
      deliverables: JSON.stringify(['High-resolution print assets', 'Vector source files (AI, SVG, EPS)', 'Brand guidelines & typography scales', 'Digital collateral kit']),
      packages_json: JSON.stringify([
        { name: 'Starter Kit', details: 'Brand mark, basic vector assets & color palette', price: 'Custom Quote' },
        { name: 'Full Identity Suite', details: 'Comprehensive design system, collaterals & guidelines', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80',
      display_order: 1
    },
    {
      id: 'srv_2',
      title: 'Event Posters and Branding',
      slug: 'event-posters-and-branding',
      short_desc: 'Cinematic promotional posters, stage screen graphics, and cohesive visual identities for major events.',
      full_desc: 'Transform your conferences, cultural fests, music concerts, and corporate galas into memorable experiences. We build the entire visual ecosystem—from teaser campaigns and hero posters to ambient LED backdrop graphics and badge credentials.',
      icon_name: 'Ticket',
      deliverables: JSON.stringify(['Main promotional poster series', 'Social countdown graphics', 'LED stage background motion loops', 'On-ground directional signage & badges']),
      packages_json: JSON.stringify([
        { name: 'Event Campaign', details: 'Teaser posters, main reveal & social promo pack', price: 'Custom Quote' },
        { name: '360° Event Branding', details: 'Full stage visuals, print materials & digital campaign', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80',
      display_order: 2
    },
    {
      id: 'srv_3',
      title: 'Photography',
      slug: 'photography',
      short_desc: 'Commercial, editorial, and event photography captured with prime optics and master color grading.',
      full_desc: 'Our lens masters capture the pulse, emotion, and intricate details of every moment. Whether it is a high-octane corporate summit, an exclusive fashion reveal, or an atmospheric portrait session, our color-graded stills tell captivating stories.',
      icon_name: 'Camera',
      deliverables: JSON.stringify(['Master curated high-res stills', 'Professional color-graded gallery', 'Web-optimized exports', 'Private cloud delivery archive']),
      packages_json: JSON.stringify([
        { name: 'Half-Day Shoot', details: '4 hours on-location coverage with color-graded selects', price: 'Custom Quote' },
        { name: 'Full-Day Commercial', details: '8+ hours multi-camera shoot with same-day sneak peeks', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
      display_order: 3
    },
    {
      id: 'srv_4',
      title: 'Videography',
      slug: 'videography',
      short_desc: 'Cinematic multi-camera 4K coverage with intentional lighting, fluid gimbal motion, and pristine audio.',
      full_desc: 'From corporate brand documentaries to high-energy stage performances, we employ cinema cameras, gimbal stabilization, aerial drones, and studio lighting to produce filmic footage that stands apart from standard video.',
      icon_name: 'Video',
      deliverables: JSON.stringify(['4K Cinema master footage', 'Multi-angle synchronized audio/video', 'Color graded in DaVinci Resolve', 'Raw archive delivery upon request']),
      packages_json: JSON.stringify([
        { name: 'Production Sprint', details: 'Single-day targeted multi-lens cinematography', price: 'Custom Quote' },
        { name: 'Documentary Grade', details: 'Multi-crew cinema rig coverage with drone & directional audio', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?auto=format&fit=crop&w=900&q=80',
      display_order: 4
    },
    {
      id: 'srv_5',
      title: 'Highlight Videos',
      slug: 'highlight-videos',
      short_desc: 'Emotional, high-energy aftermovies and highlight films with curated rhythm, sound design, and pacing.',
      full_desc: 'We compress hours of event energy into a pulse-pounding, cinematic 2-to-3 minute highlight film. Every cut hits the beat, every transition feels organic, and bespoke sound design elevates the emotional crescendo.',
      icon_name: 'Film',
      deliverables: JSON.stringify(['Cinematic 4K Aftermovie / Highlight film', 'Short teaser cut (60 seconds)', 'Custom licensed soundtrack score', 'Audio sound design & mix']),
      packages_json: JSON.stringify([
        { name: 'Essential Highlight', details: '2-minute high-energy cut with licensed soundtrack', price: 'Custom Quote' },
        { name: 'Director Cut Edition', details: 'Full 3-5 minute narrative film + 3 social teaser cuts', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80',
      display_order: 5
    },
    {
      id: 'srv_6',
      title: 'Reels and Short Videos',
      slug: 'reels-and-short-videos',
      short_desc: 'High-retention 9:16 vertical video assets optimized for Instagram Reels, YouTube Shorts, and TikTok.',
      full_desc: 'Vertical video commands modern attention. We craft rapid-fire, scroll-stopping Reels featuring dynamic kinetic typography, seamless speed ramps, trend-conscious audio pairing, and hook-driven intros that skyrocket engagement.',
      icon_name: 'Smartphone',
      deliverables: JSON.stringify(['Batch vertical 9:16 exports', 'Kinetic typography captioning', 'Hook variations for A/B testing', 'Platform-optimized audio mix']),
      packages_json: JSON.stringify([
        { name: 'Sprint Pack (5 Reels)', details: '5 curated short-form videos with subtitles and hooks', price: 'Custom Quote' },
        { name: 'Growth Pack (15 Reels)', details: '15 cinematic short-form reels for monthly organic dominance', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=900&q=80',
      display_order: 6
    },
    {
      id: 'srv_7',
      title: 'Brochures and Digital Publications',
      slug: 'brochures-and-digital-publications',
      short_desc: 'Interactive digital brochures, e-books, and tactile corporate print collateral with precision editorial layouts.',
      full_desc: 'Present your brand with sophisticated editorial panache. We design corporate profiles, prospectus documents, product lookbooks, and interactive PDFs equipped with clickable links, bookmarks, and rich visual pacing.',
      icon_name: 'BookOpen',
      deliverables: JSON.stringify(['Print-ready CMYK PDF with bleed', 'Interactive digital PDF with hyperlinks', 'High-res digital mockups', 'Source InDesign/Figma package']),
      packages_json: JSON.stringify([
        { name: 'Corporate Profile', details: '8-12 page sleek corporate brochure & digital PDF', price: 'Custom Quote' },
        { name: 'Comprehensive Prospectus', details: '24+ page luxury editorial layout & print specification', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80',
      display_order: 7
    },
    {
      id: 'srv_8',
      title: 'Magazine Design',
      slug: 'magazine-design',
      short_desc: 'Full-edition publication layout, cover art direction, article typesetting, and print prepress mastery.',
      full_desc: 'From independent cultural zines to luxury lifestyle magazines and university annuals, our publication team manages typography, grid architecture, column rhythm, pull quotes, and photo curation across hundreds of pages.',
      icon_name: 'Layers',
      deliverables: JSON.stringify(['Complete editorial book layout', 'Iconic cover art direction & variant', 'Pre-flight certified print PDF', 'Digital flipbook edition']),
      packages_json: JSON.stringify([
        { name: 'Special Edition Zine', details: '32-page compact publication layout and art direction', price: 'Custom Quote' },
        { name: 'Full Volume Magazine', details: '80-120 page publication design with prepress certification', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
      display_order: 8
    },
    {
      id: 'srv_9',
      title: 'Product Shoots',
      slug: 'product-shoots',
      short_desc: 'Studio tabletop and lifestyle product photography with macro lighting and flawless retouching.',
      full_desc: 'Make products look irresistible. We shoot cosmetics, culinary crafts, tech devices, apparel, and beverage bottles with micro-detail lighting, subtle reflections, textured backdrops, and photorealistic composite retouching.',
      icon_name: 'Sparkles',
      deliverables: JSON.stringify(['Clean e-commerce white/grey background stills', 'Styled atmospheric lifestyle compositions', 'Multi-angle detail shots & texture closeups', 'Retouched transparent PNG cutouts']),
      packages_json: JSON.stringify([
        { name: 'E-commerce Catalog', details: '10 products, 4 angles each with clean cutout backgrounds', price: 'Custom Quote' },
        { name: 'Hero Lifestyle Campaign', details: 'Styled hero compositions with props and environmental sets', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
      display_order: 9
    },
    {
      id: 'srv_10',
      title: 'Packaging Design',
      slug: 'packaging-design',
      short_desc: 'Structural and graphic packaging design that jumps off shelves and enchants unboxing experiences.',
      full_desc: 'Your product packaging is the tangible touchpoint of your brand. We design custom box dielines, pouches, foil stamps, spot UV effects, labels, and eco-friendly packaging systems backed by photorealistic 3D renders.',
      icon_name: 'Package',
      deliverables: JSON.stringify(['Production-ready dieline files with die cuts', 'Specification sheet for print vendors', '3D photorealistic unboxing mockups', 'Compliance & barcoding integration']),
      packages_json: JSON.stringify([
        { name: 'Single SKU Packaging', details: 'Dieline graphic, label & 3D presentation renders', price: 'Custom Quote' },
        { name: 'Packaging Line (3-5 SKUs)', details: 'Cohesive series across variants with vendor print guidance', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1589365278144-c9e705f843ba?auto=format&fit=crop&w=900&q=80',
      display_order: 10
    },
    {
      id: 'srv_11',
      title: 'Social Media Content',
      slug: 'social-media-content',
      short_desc: 'Comprehensive visual feeds, carousel storytelling, animated stories, and campaign asset suites.',
      full_desc: 'Build a cohesive, magnetic digital presence. We curate aesthetic Instagram grids, informative carousel slides, animated product showcases, and reactive promotional graphics that reflect your brand ethos consistently.',
      icon_name: 'Share2',
      deliverables: JSON.stringify(['Monthly 30-post visual asset pack', 'Swipeable educational carousels', 'Animated motion stories', 'Editable Canva/Figma templates']),
      packages_json: JSON.stringify([
        { name: 'Monthly Content Engine', details: '16 branded posts + 8 motion stories per month', price: 'Custom Quote' },
        { name: '360° Social Takeover', details: 'Daily content, reels, stories & community graphic kit', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=900&q=80',
      display_order: 11
    },
    {
      id: 'srv_12',
      title: 'Custom Creative Solutions',
      slug: 'custom-creative-solutions',
      short_desc: 'Bespoke hybrid creative ventures, multi-media installations, 3D projections, and specialized commissions.',
      full_desc: 'Have a daring concept that blends physical spaces with digital visuals? We engineer custom solutions including interactive LED stage walls, multi-platform brand launches, bespoke 3D motion pieces, and tailored creative consulting.',
      icon_name: 'Cpu',
      deliverables: JSON.stringify(['Tailored creative roadmap & architectural brief', 'Custom multi-format deliverables', 'Technical execution & deployment support', 'Dedicated creative lead']),
      packages_json: JSON.stringify([
        { name: 'Custom Project Sprint', details: 'Scope defined collaboratively based on requirements', price: 'Custom Quote' }
      ]),
      image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
      display_order: 12
    }
  ];

  for (const s of servicesData) {
    insertService.run(s.id, s.title, s.slug, s.short_desc, s.full_desc, s.icon_name, s.deliverables, s.packages_json, s.image_url, s.display_order, 1);
  }

  // 4. Seed Team Positions
  const insertPos = db.prepare('INSERT INTO team_positions (id, title, department, description) VALUES (?, ?, ?, ?)');
  insertPos.run('pos_1', 'Founder & Creative Director', 'Executive', 'Leads brand vision, creative strategy, and artistic standards.');
  insertPos.run('pos_2', 'Co-Founder & Operations Lead', 'Operations', 'Oversees client success, timelines, production pipelines, and logistics.');
  insertPos.run('pos_3', 'Design Lead', 'Creative', 'Directs visual identities, typography systems, and print architecture.');
  insertPos.run('pos_4', 'Cinematography & Videography Lead', 'Production', 'Oversees 4K multi-cam production, camera rigs, and lighting design.');
  insertPos.run('pos_5', 'Post-Production & Editing Lead', 'Post-Production', 'Directs color grading, kinetic motion graphics, and audio mix.');
  insertPos.run('pos_6', 'Photography Lead', 'Production', 'Directs commercial, fashion, and live event optics.');
  insertPos.run('pos_7', 'Marketing and Communications Lead', 'Marketing', 'Leads brand narratives, campaign growth, and media relations.');

  // 5. Seed Core Committee & Leadership Team
  const insertTeam = db.prepare(`
    INSERT INTO team_members (id, full_name, position, department, bio, photo_url, email, social_links_json, joining_date, is_active, display_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const teamData = [
    {
      id: 'tm_1',
      full_name: 'Aravind Menon',
      position: 'Founder & Creative Director',
      department: 'Executive',
      bio: 'Visionary creative director with over a decade of experience across commercial cinematography, high-end branding, and digital media art direction.',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      email: 'aravind@visualwoxx.com',
      social_links_json: JSON.stringify({ instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' }),
      joining_date: '2022-01-15',
      display_order: 1
    },
    {
      id: 'tm_2',
      full_name: 'Meera Nair',
      position: 'Co-Founder & Operations Lead',
      department: 'Operations',
      bio: 'Operations strategist specializing in multi-scale event production, client accounts, and lean creative workflows with relentless attention to detail.',
      photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      email: 'meera@visualwoxx.com',
      social_links_json: JSON.stringify({ instagram: 'https://instagram.com', linkedin: 'https://linkedin.com' }),
      joining_date: '2022-01-15',
      display_order: 2
    },
    {
      id: 'tm_3',
      full_name: 'Devanand K',
      position: 'Design Lead',
      department: 'Creative',
      bio: 'Typography and brand identity specialist whose work has shaped cultural festivals, tech brand packaging, and modern digital design systems.',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      email: 'devanand@visualwoxx.com',
      social_links_json: JSON.stringify({ behance: 'https://behance.net', linkedin: 'https://linkedin.com' }),
      joining_date: '2022-06-01',
      display_order: 3
    },
    {
      id: 'tm_4',
      full_name: 'Rohit Balakrishnan',
      position: 'Cinematography & Videography Lead',
      department: 'Production',
      bio: 'Cinema camera specialist with an intuitive feel for natural and dramatic lighting, gimbal tracking, and multi-cam festival concert stages.',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      email: 'rohit@visualwoxx.com',
      social_links_json: JSON.stringify({ youtube: 'https://youtube.com', instagram: 'https://instagram.com' }),
      joining_date: '2022-08-10',
      display_order: 4
    },
    {
      id: 'tm_5',
      full_name: 'Pooja Krishnan',
      position: 'Post-Production & Editing Lead',
      department: 'Post-Production',
      bio: 'DaVinci Resolve colorist and rhythm-obsessed editor who crafts the signature electric mood and narrative pacing of Visual Woxx films.',
      photo_url: 'https://images.unsplash.com/photo-1534751516642-a171ed271b8e?auto=format&fit=crop&w=600&q=80',
      email: 'pooja@visualwoxx.com',
      social_links_json: JSON.stringify({ vimeo: 'https://vimeo.com', instagram: 'https://instagram.com' }),
      joining_date: '2023-01-20',
      display_order: 5
    },
    {
      id: 'tm_6',
      full_name: 'Siddharth Varma',
      position: 'Photography Lead',
      department: 'Production',
      bio: 'Editorial and commercial portrait photographer capturing raw emotion, textured details, and editorial compositions for elite brands.',
      photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
      email: 'siddharth@visualwoxx.com',
      social_links_json: JSON.stringify({ instagram: 'https://instagram.com' }),
      joining_date: '2023-03-15',
      display_order: 6
    },
    {
      id: 'tm_7',
      full_name: 'Ananya Varma',
      position: 'Marketing & Communications Lead',
      department: 'Marketing',
      bio: 'Brand communicator connecting visual storytelling with organic digital reach, creative community partnerships, and client relations.',
      photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      email: 'ananya@visualwoxx.com',
      social_links_json: JSON.stringify({ linkedin: 'https://linkedin.com' }),
      joining_date: '2023-05-01',
      display_order: 7
    }
  ];

  for (const t of teamData) {
    insertTeam.run(t.id, t.full_name, t.position, t.department, t.bio, t.photo_url, t.email, t.social_links_json, t.joining_date, 1, t.display_order);
  }

  // 6. Seed Featured & Categorized Portfolio Projects
  const insertProject = db.prepare(`
    INSERT INTO portfolio_projects (id, title, slug, category, client_name, project_date, description, services_provided_json, cover_image, video_url, is_featured, display_order, is_published, credits_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMedia = db.prepare(`
    INSERT INTO portfolio_media (id, portfolio_project_id, media_type, media_url, caption, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const portfolioData = [
    {
      id: 'port_1',
      title: 'Neon Odyssey: Electronic Music Festival 2026',
      slug: 'neon-odyssey-music-festival',
      category: 'Event Coverage',
      client_name: 'Odyssey Events & Live Nation',
      project_date: 'February 2026',
      description: 'Complete 360° visual coverage and live media command for a 3-day electronic music festival attended by over 25,000 festival-goers. Delivered 4K multi-cam concert coverage, hourly social Reels, and a cinematic master aftermovie.',
      services_provided: ['Event Photography', 'Cinematic Videography', 'Highlight Videos', 'Instagram Reels'],
      cover_image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: 1,
      display_order: 1,
      credits: { 'Creative Direction': 'Aravind Menon', 'Lead DP': 'Rohit Balakrishnan', 'Editor & Colorist': 'Pooja Krishnan' },
      media: [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_2',
      title: 'Aura Botanicals: Luxury Skincare Packaging & Identity',
      slug: 'aura-botanicals-packaging',
      category: 'Packaging Design',
      client_name: 'Aura Skincare Labs',
      project_date: 'January 2026',
      description: 'Engineered an ultra-minimalist packaging architecture and tactile unboxing experience for an organic luxury skincare line. Utilized custom frosted glass bottle dielines, debossed metallic foil stamping, and photorealistic 3D renders.',
      services_provided: ['Packaging Design', 'Graphic Design', 'Product Shoots', 'Branding'],
      cover_image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      is_featured: 1,
      display_order: 2,
      credits: { 'Design Lead': 'Devanand K', 'Photography': 'Siddharth Varma' },
      media: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_3',
      title: 'Apex Mobility: Autonomous EV Launch Campaign',
      slug: 'apex-mobility-ev-launch',
      category: 'Videography',
      client_name: 'Apex NextGen Automotive',
      project_date: 'December 2025',
      description: 'A cinematic commercial campaign unveiling Apex’s flagship electric vehicle. Featuring high-speed precision tracking car shots, anamorphic lens flares, dynamic kinetic UI animations, and immersive sound design.',
      services_provided: ['Videography', 'Highlight Videos', 'Custom Creative Solutions'],
      cover_image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: 1,
      display_order: 3,
      credits: { 'Director': 'Aravind Menon', 'Cinematographer': 'Rohit Balakrishnan', 'Motion FX': 'Pooja Krishnan' },
      media: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_4',
      title: 'Vogue Chroma: International Design & Art Annual Zine',
      slug: 'vogue-chroma-magazine',
      category: 'Graphic Design',
      client_name: 'Chroma Visual Publishing',
      project_date: 'November 2025',
      description: 'Art direction and complete 128-page magazine editorial layout celebrating experimental typography, contemporary photography, and generative media art. Prepress certified for luxury Swiss matte stock printing.',
      services_provided: ['Magazine Design', 'Brochures and Digital Publications', 'Graphic Design'],
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      is_featured: 1,
      display_order: 4,
      credits: { 'Art Director': 'Devanand K', 'Editorial Lead': 'Ananya Varma' },
      media: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_5',
      title: 'Kinetix Watches: Studio Micro-Macro Product Campaign',
      slug: 'kinetix-luxury-watch-shoot',
      category: 'Product Shoots',
      client_name: 'Kinetix Horology Geneva',
      project_date: 'October 2025',
      description: 'Precision studio product photography showcasing hand-assembled tourbillon mechanisms. Utilized focus-stacking macro optics, motorized light painting, and zero-gravity reflection staging.',
      services_provided: ['Product Shoots', 'Commercial Photography', 'Digital Retouching'],
      cover_image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      is_featured: 0,
      display_order: 5,
      credits: { 'Lead Photographer': 'Siddharth Varma', 'Retoucher': 'Devanand K' },
      media: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_6',
      title: 'Global Tech Confluence: 2025 Identity & Stage Visuals',
      slug: 'global-tech-confluence-branding',
      category: 'Event Coverage',
      client_name: 'GTC Ventures',
      project_date: 'September 2025',
      description: 'Comprehensive identity architecture, multi-format event posters, and 4K ultra-wide curved LED stage backdrops for a premier artificial intelligence conference attended by 5,000 delegates.',
      services_provided: ['Event Posters and Branding', 'Graphic Design', 'Highlight Videos'],
      cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: 0,
      display_order: 6,
      credits: { 'Creative Director': 'Aravind Menon', 'Stage Visuals': 'Pooja Krishnan' },
      media: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_7',
      title: 'Solstice Fashion Week: High-Speed Viral Reels Sprint',
      slug: 'solstice-fashion-week-reels',
      category: 'Reels',
      client_name: 'Solstice Haute Couture',
      project_date: 'August 2025',
      description: 'Real-time runway capture turned into 20 high-retention 9:16 vertical video stories and Reels. Achieved over 4.2 million organic views across Instagram with bespoke kinetic subtitles and synchronized bass drops.',
      services_provided: ['Reels and Short Videos', 'Videography', 'Social Media Content'],
      cover_image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      is_featured: 0,
      display_order: 7,
      credits: { 'Reels Producer': 'Pooja Krishnan', 'Cam Op': 'Rohit Balakrishnan' },
      media: [
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
      ]
    },
    {
      id: 'port_8',
      title: 'Velvet Roast: Artisanal Coffee Branding & Content',
      slug: 'velvet-roast-coffee-branding',
      category: 'Branding',
      client_name: 'Velvet Roast Roasters',
      project_date: 'July 2025',
      description: 'End-to-end creative direction: typography logo, biodegradable pouch dieline packaging, cafe signage, ambient lifestyle photo shoot, and monthly social media creative kit.',
      services_provided: ['Branding', 'Packaging Design', 'Product Shoots', 'Social Media Content'],
      cover_image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      is_featured: 0,
      display_order: 8,
      credits: { 'Brand Designer': 'Devanand K', 'Photographer': 'Siddharth Varma' },
      media: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
      ]
    }
  ];

  for (const p of portfolioData) {
    insertProject.run(
      p.id, p.title, p.slug, p.category, p.client_name, p.project_date,
      p.description, JSON.stringify(p.services_provided), p.cover_image,
      p.video_url, p.is_featured, p.display_order, 1, JSON.stringify(p.credits)
    );

    let mIdx = 1;
    for (const mUrl of p.media) {
      insertMedia.run(`med_${p.id}_${mIdx}`, p.id, 'image', mUrl, `${p.title} Preview ${mIdx}`, mIdx);
      mIdx++;
    }
  }

  // 7. Seed Sample Clients
  const insertClient = db.prepare(`
    INSERT INTO clients (id, name, email, phone, organization, services_requested, project_history, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertClient.run('cl_1', 'Rohan Mathur', 'rohan@odysseyevents.in', '+91 98950 11223', 'Odyssey Events & Media', 'Event Coverage, Highlight Videos, Reels', 'Neon Odyssey Festival 2026', 'High priority recurring festival partner. Always prefers 4K delivery.', 'active');
  insertClient.run('cl_2', 'Dr. Radhika Sen', 'radhika@aurabotanicals.com', '+91 97440 33445', 'Aura Skincare Labs', 'Packaging Design, Product Shoots', 'Aura Botanicals Luxury Series', 'Needs eco-friendly dielines and luxury matte textures.', 'active');
  insertClient.run('cl_3', 'Vikramaditya Roy', 'vikram@apexnextgen.com', '+91 94470 55667', 'Apex Mobility', 'Videography, Commercial Shoots', 'Apex EV Launch Film', 'Automotive commercial specialist requested.', 'active');
  insertClient.run('cl_4', 'Sanjana Pillai', 'sanjana@solsticefashion.com', '+91 96330 77889', 'Solstice Haute Couture', 'Reels, Social Media Content', 'Solstice Fashion Week 2025', 'Requires rapid 2-hour turnaround for live runway cuts.', 'active');

  // 8. Seed Sample Inquiries
  const insertInquiry = db.prepare(`
    INSERT INTO inquiries (id, full_name, email, phone, organization, services_json, project_title, project_description, event_date, preferred_appointment_date, preferred_appointment_time, budget_range, preferred_contact_method, status, client_id, internal_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertInquiry.run(
    'inq_1', 'Kavya Chandran', 'kavya.c@prismbrands.in', '+91 98460 99881', 'Prism Lifestyle',
    JSON.stringify(['Event Posters and Branding', 'Photography', 'Highlight Videos']),
    'Prism Annual Gala & Fashion Showcase 2026',
    'Looking for a unified creative team to cover our 2-day national gala in Kochi. Need promotional posters, on-ground photographers, and a cinematic highlight aftermovie.',
    '2026-11-20', '2026-10-30', '14:30', '₹1,50,000 - ₹3,00,000', 'Phone', 'new_inquiry', null,
    'Client called expressing urgency. Schedule preliminary discovery call.'
  );

  insertInquiry.run(
    'inq_2', 'Varun Kapoor', 'varun@kapoorspices.com', '+91 94950 88772', 'Kapoor Spices Heritage',
    JSON.stringify(['Packaging Design', 'Product Shoots', 'Graphic Design']),
    'Artisanal Organic Spice Range Packaging Redesign',
    'We are launching a premium export blend of whole spices. Need new pouch dielines, luxury gold foil elements, and tabletop lifestyle product shoots.',
    '2026-12-05', '2026-11-02', '11:00', '₹75,000 - ₹1,50,000', 'Email', 'under_review', null,
    'Devanand reviewing preliminary dieline requirements.'
  );

  insertInquiry.run(
    'inq_3', 'Rohan Mathur', 'rohan@odysseyevents.in', '+91 98950 11223', 'Odyssey Events',
    JSON.stringify(['Highlight Videos', 'Reels and Short Videos']),
    'Odyssey Sunset Sessions Summer 2026',
    'Follow up festival series. Need short form content sprint and 3-minute highlight film.',
    '2026-11-15', '2026-10-29', '16:00', '₹2,00,000 - ₹4,00,000', 'WhatsApp', 'confirmed', 'cl_1',
    'Linked to existing client Rohan Mathur. Appointment confirmed.'
  );

  // 9. Seed Appointments
  const insertAppointment = db.prepare(`
    INSERT INTO appointments (id, inquiry_id, client_id, client_name, client_email, client_phone, service_name, appointment_date, appointment_time, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAppointment.run('apt_1', 'inq_3', 'cl_1', 'Rohan Mathur', 'rohan@odysseyevents.in', '+91 98950 11223', 'Highlight Videos & Reels', '2026-10-29', '16:00', 'confirmed', 'Discovery meeting over Google Meet. Portfolio reel shared.');
  insertAppointment.run('apt_2', 'inq_1', null, 'Kavya Chandran', 'kavya.c@prismbrands.in', '+91 98460 99881', 'Event Posters and Branding', '2026-10-30', '14:30', 'new_inquiry', 'Awaiting confirmation from creative director.');
  insertAppointment.run('apt_3', 'inq_2', null, 'Varun Kapoor', 'varun@kapoorspices.com', '+91 94950 88772', 'Packaging Design', '2026-11-02', '11:00', 'new_inquiry', 'Packaging sample consultation.');

  // 10. Seed Projects & Kanban
  const insertProj = db.prepare(`
    INSERT INTO projects (id, project_name, client_id, client_name, description, services_json, assigned_team_json, assigned_freelancers_json, start_date, deadline, priority, status, progress_pct, internal_notes, deliverable_links_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProj.run(
    'prj_1', 'Aura Botanicals Phase 2 Expansion', 'cl_2', 'Dr. Radhika Sen',
    'Design of 4 supplementary elixir dropper bottles and commercial social media campaign.',
    JSON.stringify(['Packaging Design', 'Product Shoots']),
    JSON.stringify(['Devanand K', 'Siddharth Varma']),
    JSON.stringify(['Farhan Akhtar (3D Artist)']),
    '2026-10-15', '2026-11-10', 'high', 'in_progress', 65,
    'Dielines approved. Tabletop studio photography booked for Friday.',
    JSON.stringify([{ title: 'Dieline v2 PDF', url: 'https://cloud.visualwoxx.com/aura/dieline_v2.pdf' }])
  );

  insertProj.run(
    'prj_2', 'Odyssey Sunset Sessions Production', 'cl_1', 'Rohan Mathur',
    'Pre-production planning, multi-camera stage setup, drone permits, and editing templates.',
    JSON.stringify(['Videography', 'Highlight Videos']),
    JSON.stringify(['Aravind Menon', 'Rohit Balakrishnan', 'Pooja Krishnan']),
    JSON.stringify(['Nikhil Das (Drone Pilot)']),
    '2026-10-20', '2026-11-18', 'urgent', 'planning', 25,
    'Drone clearances secured. Soundboard feed cable requirements sent to venue sound team.',
    JSON.stringify([])
  );

  insertProj.run(
    'prj_3', 'Kapoor Spices Heritage Identity', 'cl_3', 'Varun Kapoor',
    'Comprehensive brand rejuvenation, logo redesign, and cultural packaging typography.',
    JSON.stringify(['Graphic Design', 'Branding']),
    JSON.stringify(['Devanand K', 'Ananya Varma']),
    JSON.stringify([]),
    '2026-10-01', '2026-10-28', 'medium', 'client_review', 90,
    'Client reviewing final moodboard and foil stamping paper mockups.',
    JSON.stringify([{ title: 'Proof Mockup', url: 'https://cloud.visualwoxx.com/kapoor/proof.pdf' }])
  );

  // 11. Seed Project Tasks
  const insertTask = db.prepare(`
    INSERT INTO project_tasks (id, project_id, title, description, assigned_to, due_date, is_completed)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertTask.run('tsk_1', 'prj_1', 'Finalize foil stamp vector paths', 'Ensure 0.25pt minimum stroke for print machine', 'Devanand K', '2026-10-29', 1);
  insertTask.run('tsk_2', 'prj_1', 'Studio macro lighting setup', 'Setup frosted gradient background & polarizers', 'Siddharth Varma', '2026-10-31', 0);
  insertTask.run('tsk_3', 'prj_1', 'Export color-graded product master cutouts', 'Transparent PNG with soft grounding contact shadow', 'Siddharth Varma', '2026-11-03', 0);

  insertTask.run('tsk_4', 'prj_2', 'Secure venue drone airspace authorization', 'File flight permit with local police commissionerate', 'Aravind Menon', '2026-10-28', 1);
  insertTask.run('tsk_5', 'prj_2', 'Prepare DaVinci Resolve festival LUT library', 'Calibrate for nocturnal stage laser saturation', 'Pooja Krishnan', '2026-11-05', 0);

  // 12. Seed Project Updates
  const insertUpdate = db.prepare(`
    INSERT INTO project_updates (id, project_id, update_type, title, description, author_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUpdate.run('upd_1', 'prj_1', 'milestone', 'Packaging Dielines Verified', 'Client approved foil stamp dimensions without revisions.', 'Devanand K');
  insertUpdate.run('upd_2', 'prj_2', 'status_change', 'Production Team Dispatched', 'Drone clearance approved; stage walkthrough completed.', 'Aravind Menon');

  // 13. Seed Freelancer Applications
  const insertApp = db.prepare(`
    INSERT INTO freelancer_applications (id, full_name, email, phone, location, primary_skill, additional_skills_json, experience_level, portfolio_url, instagram_url, linkedin_url, working_style, availability, introduction, resume_url, status, internal_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertApp.run(
    'fapp_1', 'Farhan Akhtar', 'farhan.3d@creatives.in', '+91 97450 12121', 'Bengaluru, India',
    'Motion Graphics Designer', JSON.stringify(['UI/UX Designer', 'Illustrator']),
    '5+ years', 'https://behance.net/farhanmotion', 'https://instagram.com/farhan.renders', 'https://linkedin.com/in/farhanmotion',
    'Remote / Project-based', 'Part-time (20 hrs/week)',
    'Specialist in Octane/Cinema4D luxury product animation and kinetic motion typography for high-tier brands.',
    'https://drive.google.com/sample_resume_farhan.pdf', 'accepted', 'Approved as official roster freelancer for 3D packaging work.'
  );

  insertApp.run(
    'fapp_2', 'Nikhil Das', 'nikhil.lens@visuals.in', '+91 98450 34343', 'Kochi, Kerala',
    'Videographer', JSON.stringify(['Video Editor', 'Photographer']),
    '3-5 years', 'https://vimeo.com/nikhildasvisuals', 'https://instagram.com/nikhil.cinematics', 'https://linkedin.com/in/nikhildas',
    'On-site / Event-based', 'Full-time availability',
    'Licensed DGCA drone pilot and Sony FX3 gimbal operator specializing in extreme sports and electronic music festivals.',
    'https://drive.google.com/sample_resume_nikhil.pdf', 'accepted', 'Assigned to Odyssey Sunset Sessions project.'
  );

  insertApp.run(
    'fapp_3', 'Smriti Shenoy', 'smriti.shenoy@gmail.com', '+91 99950 56565', 'Mumbai, India',
    'Graphic Designer', JSON.stringify(['Illustrator', 'Packaging Designer']),
    '1-3 years', 'https://dribbble.com/smritishenoy', 'https://instagram.com/smriti.designs', '',
    'Hybrid', 'Freelance / Contract',
    'Obsessed with editorial typography, risograph zines, and quirky packaging design with strong Indian modernism cues.',
    'https://drive.google.com/sample_resume_smriti.pdf', 'shortlisted', 'Portfolio is extremely fresh. Schedule portfolio discussion.'
  );

  insertApp.run(
    'fapp_4', 'Zainab Qureshi', 'zainab.words@studio.io', '+91 91234 56789', 'Hyderabad, India',
    'Content Writer', JSON.stringify(['Copywriter', 'Social Media Manager']),
    '3-5 years', 'https://medium.com/@zainabwords', '', 'https://linkedin.com/in/zainabq',
    'Remote', 'Part-time',
    'Sharp, provocative copywriter for luxury lifestyle and consumer brands. Crafts hooks that convert.',
    'https://drive.google.com/sample_resume_zainab.pdf', 'under_review', 'Reviewing writing samples for client pitch decks.'
  );

  // 14. Seed Approved Freelancers
  const insertFreelancer = db.prepare(`
    INSERT INTO freelancers (id, application_id, full_name, email, phone, location, primary_skill, skills_json, experience_level, portfolio_url, availability_status, rating, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFreelancer.run(
    'fl_1', 'fapp_1', 'Farhan Akhtar', 'farhan.3d@creatives.in', '+91 97450 12121', 'Bengaluru, India',
    'Motion Graphics Designer', JSON.stringify(['3D Animation', 'Cinema 4D', 'Motion Typography']),
    '5+ years', 'https://behance.net/farhanmotion', 'available', 4.9, 'Top-tier 3D product motion artist.'
  );

  insertFreelancer.run(
    'fl_2', 'fapp_2', 'Nikhil Das', 'nikhil.lens@visuals.in', '+91 98450 34343', 'Kochi, Kerala',
    'Videographer', JSON.stringify(['Drone Pilot', 'Gimbal Operator', 'Sony FX3']),
    '3-5 years', 'https://vimeo.com/nikhildasvisuals', 'available', 4.8, 'Certified drone operator and live action shooter.'
  );

  // 15. Seed Contact Messages
  const insertContact = db.prepare(`
    INSERT INTO contact_messages (id, name, email, phone, subject, message, status, is_read, internal_notes, response_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertContact.run(
    'msg_1', 'Sunil Nambiar', 'sunil@nambiarjewels.com', '+91 98471 22334',
    'Commercial Jewelry Campaign Inquiry',
    'Hello Visual Woxx team, we are planning a high-fashion gold & diamond bridal collection campaign next month. We would love to discuss photography, model casting, and short video reels.',
    'new', 0, 'High-ticket jewelry client. Aravind to review before responding.', null
  );

  insertContact.run(
    'msg_2', 'Natasha D’Souza', 'natasha@goafest.org', '+91 99220 44556',
    'Music Festival Coverage Partnership',
    'Loved your Neon Odyssey aftermovie! We want to explore bringing your videography team to Goa for our winter festival in December.',
    'in_progress', 1, 'Meera shared rate card and production specs.', 'Drafted proposal sent on Oct 25.'
  );

  // 16. Seed Notifications
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, type, title, message, link, is_read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertNotif.run('notif_1', 'inquiry', 'New Project Inquiry Received', 'Kavya Chandran submitted an inquiry for Prism Annual Gala 2026.', '/admin/inquiries', 0);
  insertNotif.run('notif_2', 'application', 'New Freelancer Application', 'Smriti Shenoy applied for Graphic Designer.', '/admin/freelancers', 0);
  insertNotif.run('notif_3', 'appointment', 'Upcoming Appointment Today', 'Meeting scheduled with Rohan Mathur at 16:00.', '/admin/appointments', 0);
  insertNotif.run('notif_4', 'message', 'Unread Contact Message', 'Sunil Nambiar sent a message regarding Commercial Jewelry Campaign.', '/admin/messages', 0);

  // 17. Seed Activity Logs
  const insertLog = db.prepare(`
    INSERT INTO activity_logs (id, action_type, description, user_name, entity_type, entity_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertLog.run('log_1', 'INITIALIZE', 'System initialized with Visual Woxx production database', 'System', 'system', 'sys');
  insertLog.run('log_2', 'UPDATE', 'Updated site settings & brand identity parameters', 'Aravind Menon', 'site_settings', 'brand');
  insertLog.run('log_3', 'CREATE', 'Created Aura Botanicals Phase 2 project', 'Meera Nair', 'projects', 'prj_1');

  console.log('Database successfully initialized and seeded with 19 tables!');
}

initializeDatabase();

module.exports = { db };
