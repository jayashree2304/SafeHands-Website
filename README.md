# Safe Hands Human Resources Organization (SHHRO) NGO Platform

A modern, production-ready, secure, and responsive web platform for **Safe Hands Human Resources Organization**, an NGO based in Trichy, Tamil Nadu, India (Founded 2010).

---

## 🌟 Key Features

- **Organisation Details**: Exact historical text, achievements (2,200+ youth trained free, 3,000+ entitlement beneficiaries, 5,000+ trees planted, 125 legal aid cases under POA Act).
- **Public Website**:
  - **Home**: Hero carousel, animated impact counters, bento focus areas, recent events, testimonials, donate & volunteer CTAs.
  - **About Us**: Vision, Mission, Focus Areas, Board Members & Trustees (Founder M. Thilaga, Treasurer K. Anjali Deevi, Trustees).
  - **Events**: Upcoming & Past events tabs with seat capacity counter and "Enroll in Event" modal (gated by OTP login).
  - **Volunteer**: Full application form with skills selection, honeypot bot trap, and consent checkbox.
  - **Donate**: Razorpay integration with preset buttons (₹500, ₹1000, ₹2500, etc.), PAN card input for 80G tax receipt, direct bank transfer info, and printable 80G tax receipt generator.
  - **Resources**: Viewable and downloadable annual/audit PDFs + Certified Organisation statutory gallery (12A, 80G, CSR, FCRA).
  - **Contact Us**: Contact form, official Trichy address, pinned Google Maps embed for 6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015, click-to-call, and click-to-email.
- **Multilingual Engine (22 Languages)**:
  - Supports 22 languages: English (en), Tamil (ta), Hindi (hi), Telugu (te), Kannada (kn), Marathi (mr), Bengali (bn), Urdu (ur - RTL), Gujarati (gu), Malayalam (ml), Punjabi (pa), Odia (or), Assamese (as), Sanskrit (sa), Konkani (kok), Spanish (es), Chinese (zh), French (fr), Arabic (ar - RTL), Portuguese (pt), Russian (ru), Japanese (ja).
  - Native name + English name switcher dropdown.
  - Full RTL (Right-to-Left) layout recalculations for Urdu & Arabic.
- **Dual Authentication System**:
  - **Visitor (User) Auth**: Passwordless 6-digit OTP (Email/Mobile) with resend cooldown timer (60s), 5-min expiry, max 5 attempts, and hashed storage.
  - **Admin Auth**: Non-discoverable route (`/admin/login`), bcrypt password hashing, TOTP 2FA (Authenticator app QR code support), rate limiting, honeypot bot trap, role-based access control, and complete audit logging.
- **Admin Management Portal**:
  - Dashboard with KPI cards & real-time audit log stream.
  - Volunteer Application Listing with search, status filters, and CSV export.
  - Events CRUD with enrollment roster view and event CSV export.
  - Annual/Audit Reports PDF link manager.
  - Certified Organisation (12A/80G) accreditations manager.
  - Contact Messages Inbox.
  - Admin Security Settings (2FA TOTP QR code generator, password update).

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Install Dependencies & Initialize Database
```bash
npm install
npx prisma db push
npx prisma generate
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔐 Credentials & Default Access

- **Admin Login Route**: `/admin/login`
- **Default Super Admin Username**: `admin`
- **Default Super Admin Password**: `SuperSecretAdminPassword123!` (or value set in `.env`)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 App Router, React 18, TypeScript 5
- **Styling**: Tailwind CSS, Custom Design Tokens (`#023613`, `#66a23f`, `#12875c`), Lucide Icons
- **Database & ORM**: SQLite / PostgreSQL with Prisma ORM
- **Payments**: Razorpay Node SDK & Client integration
- **Security**: Bcryptjs, Otplib, QRCode, Zod validation, JWT cookies, Custom Rate Limiter
