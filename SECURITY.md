# Security Architecture & Pre-Launch Checklist

This document details all security measures implemented in the **Safe Hands Human Resources Organization (SHHRO)** web platform to guarantee enterprise-grade protection, data privacy, and vulnerability resistance.

---

## 1. Concrete Security Implementations

### Authentication & Authorization
- **Dual Session Separation**: User visitor sessions (`sh_user_session`) and Admin sessions (`sh_admin_session`) use separate HttpOnly cookies with distinct scopes. User credentials or cookies can NEVER grant administrative rights.
- **Argon2id / Bcrypt Hashing**: Admin passwords are saved with cost factor $\ge 12$. Plaintext passwords are never logged or stored.
- **Cryptographic OTP Management**:
  - 6-digit cryptographically random OTPs (`crypto.randomInt`).
  - Stored strictly hashed (SHA-256).
  - 5-minute hard expiration timer.
  - Maximum 5 failed verification attempts per OTP before automatic invalidation.
  - 60-second enforced resend cooldown timer.
- **Admin 2FA (TOTP)**: Built-in Time-based One-Time Password support (Google Authenticator / Authy / 1Password) with QR code generation.
- **Server-Side Guarding**: Every `/api/admin/*` endpoint enforces server-side JWT session validation and role checks.

### Input Validation & Data Hygiene
- **Client & Server Zod Schemas**: Every incoming request payload (OTP, login, contact, volunteer, event enrollment, donation) is validated with strict type schemas.
- **Parameterized Queries**: Prisma ORM is used for database access, preventing SQL Injection vulnerabilities.
- **Honeypot Bot Protection**: Silent honeypot fields on public forms instantly detect and reject automated bot submissions.
- **Sliding-Window Rate Limiting**: All sensitive endpoints (`/api/auth/*`, `/api/volunteer`, `/api/contact`, `/api/donate/*`) enforce IP and identifier rate-limiting.

### Security Headers & Cookie Policies
- **Strict Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` for `/admin/*` and `SAMEORIGIN` for public pages.
  - `X-Robots-Tag: noindex, nofollow` for all `/admin` routes.
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- **Cookie Security**: `HttpOnly`, `SameSite=Lax/Strict`, and `Secure` flags enforced in production.

### Payment Security
- **Server-Side Razorpay Signature Verification**: HMAC-SHA256 signature verification guarantees that donation amounts and order statuses cannot be tampered with on the client side.
- **Zero Card Data Storage**: Card numbers, CVVs, and banking PINs are handled exclusively by payment gateway widgets; zero sensitive financial data touches the application server.

### Data Privacy & Compliance
- **India DPDP Act Alignment**: Includes dedicated Privacy Policy, Terms of Service, and a functional <a href="/data-deletion">Data Deletion Request Route</a>.

---

## 2. Pre-Launch Security Verification Checklist

- [x] All secrets moved to environment variables (`DATABASE_URL`, `JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
- [x] Plaintext passwords and OTPs excluded from all logger streams and console outputs.
- [x] `X-Robots-Tag: noindex` verified on `/admin` layout.
- [x] CSRF protection verified on state-changing API requests.
- [x] Rate limiting verified on OTP generation and admin authentication routes.
- [x] Input sanitization and parameterized query execution verified across all database calls.
- [x] Razorpay signature verification tested for tampered payloads.
- [x] 80G tax receipt generator verified to display configurable placeholders without fabricating statutory registration numbers.
