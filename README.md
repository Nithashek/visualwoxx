# Visual Woxx — Complete Creative Digital Solutions Platform

> **"Your Vision. Our Visuals."**

Visual Woxx is a modern, premium, fully responsive web application and internal operations platform built for **Visual Woxx**, a creative digital solutions company delivering high-end design, cinematography, event coverage, publications, and digital branding.

---

## 🚀 Key Highlights & Architecture

### 1. Brand Identity & Visual Aesthetics
* **Theme**: Deep obsidian cinema aesthetic with electric violet, neon purple, and cyan atmospheric glows.
* **Typography**: Clean, bold geometric typography using `Clash Display` (Fontshare) and `Inter` (Google Fonts).
* **Micro-Interactions**: Glassmorphism card surfaces (`backdrop-blur`), subtle glowing borders, interactive card lift, custom sleek scrollbars, and celebratory confetti upon inquiry submission.
* **Responsive**: 100% mobile, tablet, and desktop optimized with collapsible navigation drawers and flexible grids.

---

## 🌐 Public Website Capabilities

1. **Homepage (`/`)**:
   - **Hero Section**: Cinematic headline *"WE TURN IDEAS INTO VISUAL EXPERIENCES."*, supporting narrative, *"Book an Appointment"* and *"Explore Our Work"* action buttons, studio performance metrics (5+ Happy Customers, 10+ Completed Projects, 100+ Freelancers).
   - **Client Testimonials**: Verified customer feedback cards with 5-star ratings and client designations.
   - **Call-to-Action**: High-impact *"LET'S CREATE SOMETHING EXTRAORDINARY."* project kickoff section.
   - **Site Footer**: Dynamic studio branding, location (*Kerala, India*), official contact email (*contact@visualwoxx.in*), social links, legal modals (*Privacy Policy, Terms & Conditions*), and admin gateway.

2. **About Page (`/about`)**:
   - Studio philosophy, Mission, Vision, and the signature **6-Step Collaborative Approach** (*Understand Vision → Plan Approach → Develop Concepts → Execute Collaboratively → Review & Refine → Deliver Final Output*).
   - **Core Leadership Team**: Dynamically rendered from the database (*Founder & Creative Director, Operations Lead, Design Lead, Photography Lead, Videography Lead, Editing Lead, Marketing Lead*).

3. **Services Page (`/services`)**:
   - Comprehensive breakdown of all **12 Creative Services**:
     1. Graphic Design
     2. Event Posters and Branding
     3. Photography
     4. Videography
     5. Highlight Videos
     6. Reels and Short Videos
     7. Brochures and Digital Publications
     8. Magazine Design
     9. Product Shoots
     10. Packaging Design
     11. Social Media Content
     12. Custom Creative Solutions
   - Detailed deliverables checklists, transparent package tiers, and direct *"Book This Service"* integration.

4. **Book an Appointment / Project Inquiry (`/book` & Booking Modal)**:
   - Streamlined, intuitive 7-field booking flow:
     1. **Full Name**
     2. **Email Address**
     3. **Contact Number**
     4. **Service Required** (Dynamic dropdown selector)
     5. **Event Date**
     6. **Event Location**
     7. **Additional Details**
   - Real-time database persistence, duplicate submission protection, instant reference code generation, and celebration effects.
   - Synchronized with administrative appointment scheduling.

5. **Portfolio & Case Studies (`/portfolio`)**:
   - Filterable showcase grid with search functionality.
   - Interactive **Case Study Modal**: Cover photo, media gallery carousel, embedded 4K video preview, client details, deliverables tags, and creative credits (*Creative Director, Lead DP, Editor*).

6. **Join Us — Freelancer Application (`/join-us`)**:
   - *"YOUR CREATIVITY HAS A PLACE HERE."*
   - Application form with 12 creative disciplines, additional skills multi-select, portfolio URL, Instagram/LinkedIn links, working style, availability, and resume URL.
   - Direct integration into the private administrative recruitment pipeline.

7. **Contact Page (`/contact`)**:
   - Official studio email (`contact@visualwoxx.in`), location (`Kerala, India`), phone/WhatsApp, and social links fetched dynamically from live CMS settings.
   - Working contact message form routing directly to the Admin Inbox.

---

## 🔒 Secure Admin Portal (`/admin`)

Accessible via the lock icon in the navigation bar and footer.

### Administrative Credentials:
| Role | Username | Password | Scope |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Complete administrative access: Appointments, Projects, Inquiries, Freelancers, Portfolio, Reviews, Content, and Team |

### Unified Admin Dashboard Capabilities:
* **Appointments & Project Decisions**:
  - Comprehensive view of client bookings with client contact, requested service, event date, event location, and detailed project scope.
  - **Project Decision Controls**: One-click **Approve Project** (automatically provisions client & active project in the system), **Decline / Reject**, or **Mark Confirmed**.
  - Rescheduling controls and meeting notes management.
* **Functional Dashboard**: Real-time KPI counters (Freelancers, Pending Applications, Portfolio Works, Active Reviews, and Inquiries) with instant management shortcuts.
* **Freelance Details Handling**: Review applicant pipeline with direct portfolio & resume links, status evaluator (`new_application`, `under_review`, `approved`, `rejected`), and active crew roster management with availability and star ratings.
* **Portfolio Detail Handling**: Add, edit, preview, and delete case studies; update titles, categories, client details, cover imagery, 4K video preview links, deliverable tags, and gallery photos; toggle featured and published states.
* **Review Updation & Feedback**: Create, edit, and update client testimonial quotes, ratings (1–5 stars), and designations with live sync to the public homepage's *"What Clients Say"* section.
* **Inquiries & Discovery**: Review prospective client scopes, budgets, preferred contact methods, and update appointment and project consultation statuses.
* **Freelancer Roster**: Two tabs: *Applications Pipeline* (review portfolios, resumes, and evaluate applicants) and *Approved Roster* (track skills, availability status, and ratings).
* **Portfolio CMS**: Publish, edit, feature, and delete case studies and media gallery items.
* **Services CMS**: Manage all 12 services, update deliverables, and change display ordering.
* **Core Team CMS**: Manage leadership members, update positions, bio summaries, and photos (updates the public About page in real-time).
* **Message Inbox**: Review contact submissions, toggle read/unread, and record response notes.
* **Website Content CMS**: Live editable brand name, tagline, hero text, about copy, mission/vision, contact info, and footer.
* **Activity Logs & RBAC**: Real-time audit trail and permission matrix.

---

## 🗄️ Relational Database Schema (SQLite)

The database schema (`server/data/visual_woxx.db`) strictly implements all 19 tables:
1. `profiles`
2. `clients`
3. `services`
4. `inquiries`
5. `appointments`
6. `projects`
7. `project_tasks`
8. `project_updates`
9. `freelancer_applications`
10. `freelancers`
11. `project_assignments`
12. `portfolio_projects`
13. `portfolio_media`
14. `team_members`
15. `team_positions`
16. `contact_messages`
17. `notifications`
18. `site_settings`
19. `activity_logs`

---

## 💻 Running the Application Locally

```bash
# Install dependencies
npm install

# Start both Backend API (Port 5000) and Frontend (Port 3000) simultaneously:
npm run dev
```

* **Public Website**: [http://localhost:3000](http://localhost:3000)
* **Admin Portal**: [http://localhost:3000](http://localhost:3000) (Navigate to `/admin` or click the lock/shield icon)
* **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
