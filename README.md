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
   - **Hero Section**: Cinematic headline *"WE TURN IDEAS INTO VISUAL EXPERIENCES."*, supporting narrative, *"Start a Project"* and *"Explore Our Work"* action buttons, plus interactive video showcase cards.
   - **Company Advantage**: Highlights the benefit of accessing multiple creative services through one unified in-house team.
   - **12 Services Overview**: Cards with bespoke icons, short descriptions, included deliverables, and *"Book Now"* shortcuts.
   - **Featured Portfolio**: Live case study grid with category filter tabs (*Event Coverage, Graphic Design, Photography, Videography, Reels, Branding, Packaging Design, Product Shoots*).
   - **Why Choose Visual Woxx?**: 6 pillars of creative and operational excellence.
   - **Call-to-Action & Footer**: Complete contact information, social channels, legal modals, and direct admin gateway.

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

4. **Book an Appointment / Project Inquiry (`/book`)**:
   - Complete multi-service selection, project title & scope description, target event date, preferred appointment date & time picker, budget range selector, and preferred contact method (*Email, Phone, WhatsApp*).
   - Real-time database persistence, duplicate submission protection, and instant reference ID.

5. **Portfolio & Case Studies (`/portfolio`)**:
   - Filterable showcase grid with search functionality.
   - Interactive **Case Study Modal**: Cover photo, media gallery carousel, embedded 4K video preview, client details, deliverables tags, and creative credits (*Creative Director, Lead DP, Editor*).

6. **Join Us — Freelancer Application (`/join-us`)**:
   - *"YOUR CREATIVITY HAS A PLACE HERE."*
   - Application form with 12 creative disciplines, additional skills multi-select, portfolio URL, Instagram/LinkedIn links, working style, availability, and resume URL.
   - Direct integration into the private administrative recruitment pipeline.

7. **Contact Page (`/contact`)**:
   - Official studio email, phone/WhatsApp, physical studio address, and social links fetched dynamically from live CMS settings.
   - Working contact message form routing directly to the Admin Inbox.

---

## 🔒 Secure Admin Portal (`/admin`)

Accessible via the lock icon in the navigation bar and footer.

### Administrative Credentials & Roles for Testing:
| Role | Username | Password | Permissions Scope |
|---|---|---|---|
| **Super Admin** | `admin` | `admin123` | Full system access across all 19 database tables |
| **Operations Admin** | `operations` | `ops123` | Inquiries, appointments, client accounts, Kanban projects |
| **Creative Admin** | `creative` | `creative123` | Portfolio case studies, services, and team profiles |
| **Recruitment Admin** | `recruiter` | `recruiter123` | Freelancer application reviews and approved talent roster |

### Modules:
* **Dashboard**: Real-time aggregate KPIs (*Total Clients, New Inquiries, Active Projects, Completed Projects, Pending Tasks, Upcoming Appointments, Total Freelancers, New Applications, Unread Messages*) and activity stream.
* **Project Inquiries**: Filter by status (*New Inquiry, Under Review, Confirmed, Cancelled*), review scopes, add internal notes, and click **"Convert to Active Project & Client"** to auto-generate client and project records.
* **Appointments**: Table and schedule views with Confirm, Reschedule, and Cancel workflows.
* **Projects & Kanban**: 8-stage Kanban board (*Inquiry Received, Planning, In Progress, Client Review, Revisions, Completed, On Hold, Cancelled*) + Table view. Interactive subtasks checklist, progress sliders, deliverable links, and timelines.
* **Clients**: Directory of client brands, contact details, requested services, and project histories.
* **Freelancer Roster**: Two tabs: *Applications Pipeline* (review portfolios, resumes, and evaluate applicants) and *Approved Roster* (track skills, availability status, and ratings).
* **Portfolio CMS**: Publish, edit, feature, and delete case studies and media gallery items.
* **Services CMS**: Manage all 12 services, update deliverables, and change display ordering.
* **Core Team CMS**: Manage leadership members, update positions, bio summaries, and photos (updates the public About page in real-time).
* **Message Inbox**: Review contact submissions, toggle read/unread, and record response notes.
* **Website Content CMS**: Live editable brand name, tagline, hero text, about copy, mission/vision, contact info, and footer.
* **Activity Logs & RBAC**: Real-time audit trail and permission matrix.

---

## 🗄️ Relational Database Schema (SQLite)

The database schema (`server/data/visual_woxx.db`) strictly implements all 19 tables specified in Section 11:
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
* **Admin Portal**: [http://localhost:3000](http://localhost:3000) (Navigate to `/admin` or click the Shield icon in the navbar)
* **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
