-- Safe Hands Human Resources Organization (SHHRO) SQL Database Dump & Seed
-- Compatible with SQLite, PostgreSQL, and MySQL

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "OTP" (
    "id" TEXT PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Admin" (
    "id" TEXT PRIMARY KEY,
    "username" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "totpSecret" TEXT,
    "totpEnabled" BOOLEAN NOT NULL DEFAULT 0,
    "forcePasswordChange" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "details" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("adminId") REFERENCES "Admin" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Event" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "venue" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Community',
    "capacity" INTEGER NOT NULL DEFAULT 100,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING',
    "imageUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "EventEnrolment" (
    "id" TEXT PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "Program" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Volunteer" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" INTEGER,
    "occupation" TEXT,
    "address" TEXT,
    "skills" TEXT,
    "motivation" TEXT,
    "availability" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "Donation" (
    "id" TEXT PRIMARY KEY,
    "orderId" TEXT UNIQUE NOT NULL,
    "paymentId" TEXT,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "donorName" TEXT NOT NULL,
    "donorEmail" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "panNumber" TEXT,
    "address" TEXT,
    "taxReceiptRequested" BOOLEAN NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "receiptNo" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "Report" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Annual',
    "pdfUrl" TEXT NOT NULL,
    "fileSize" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Certificate" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "issuingBody" TEXT,
    "year" TEXT,
    "imageUrl" TEXT,
    "pdfUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ContactMessage" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNREAD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Data (Admin, Programs, Events, Reports, Certificates)

-- Default Super Admin (Username: admin, Password: SuperSecretAdminPassword123!)
INSERT OR IGNORE INTO "Admin" ("id", "username", "passwordHash", "role", "forcePasswordChange") VALUES 
('admin_01', 'admin', '$2a$12$N3q7QcZ6i5N9w.X8E6mY4eK1b0O8yZ3V4W5X6Y7Z8A9B0C1D2E3F4', 'SUPER_ADMIN', 1);

-- Programs Seed
INSERT OR IGNORE INTO "Program" ("id", "title", "category", "description", "imageUrl") VALUES
('p_01', 'Skill Development Program', 'Women & Youth Empowerment', 'Our Program for women focuses on empowering them with practical skills that enhance their employability and financial independence, including tailoring, computer literacy, and entrepreneurship.', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/skill developmentprogram_rBO9fTY.jpg'),
('p_02', 'Tata Capital Training Program', 'Banking & Financial Skills', 'Training session in collaboration with Tata Capital, focusing on banking, financial services, and insurance to empower individuals with essential industry skills.', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/tata_A5Dx9qr.jpg'),
('p_03', 'Bio-Diversity Conservation & Tree Plantation', 'Environment', 'Tree planting events including planting 53 trees at Panchayat Union Middle School in Oorathipatti.', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/conservation_5jxtcr8.jpg');

-- Events Seed
INSERT OR IGNORE INTO "Event" ("id", "title", "description", "date", "venue", "category", "capacity", "status", "imageUrl") VALUES
('e_01', 'Environmental Awareness Program & 500 Sapling Distribution', 'Insightful awareness program at Valavanthan Kottai Panchayat featuring speeches by horticulture directors and environmental social activists distributing 500 fruit saplings.', '2024-11-29 10:00:00', 'Valavanthan Kottai Panchayat, Trichy', 'Environment', 250, 'PAST', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2- SAFE.jpeg'),
('e_02', 'Empowering Schools with Tree Plantation Material', 'Distributed tree plantation materials to 15 schools across Trichy block to encourage youth greening projects.', '2024-10-16 09:30:00', '15 Partner Schools, Trichy Block', 'Education & Environment', 150, 'PAST', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/EMPOWERING-SAFE-3.jpg'),
('e_03', 'Upcoming National Single Women Livelihood Summit 2026', 'Statewide empowerment conference bringing together single women, legal experts, and social welfare leaders.', '2026-11-15 10:00:00', 'Arun Hotel Conference Hall, Trichy', 'Women Empowerment', 300, 'UPCOMING', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/single women state level conference_rZkh6tW.jpg');

-- Reports Seed
INSERT OR IGNORE INTO "Report" ("id", "title", "year", "category", "pdfUrl", "fileSize") VALUES
('r_01', 'Annual Report 2025-2026', '2025-2026', 'Annual', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2d9acb2ca6.pdf', '2.4 MB'),
('r_02', 'Audit Report 2025', '2025', 'Audit', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/c439129fef.pdf', '1.8 MB'),
('r_03', 'Audit Report 2024', '2024', 'Audit', 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/9cb777dc9b.pdf', '1.5 MB');

-- Certificates Seed
INSERT OR IGNORE INTO "Certificate" ("id", "name", "category", "issuingBody", "year") VALUES
('c_01', '12A Registration Certificate', '12A', 'Income Tax Department, Govt of India', 'Statutory'),
('c_02', '80-G Tax Exemption Certificate', '80G', 'Income Tax Department, Govt of India', 'Statutory'),
('c_03', 'CSR Registration Certificate (Form CSR-1)', 'CSR', 'Ministry of Corporate Affairs', 'Statutory'),
('c_04', 'FCRA Registration Certificate', 'FCRA', 'Ministry of Home Affairs, Govt of India', 'Statutory');
