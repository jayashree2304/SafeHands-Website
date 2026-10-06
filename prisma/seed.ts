import { PrismaClient } from '@prisma/client';
import { AdminRole, EventStatus } from '../src/lib/enums';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Safe Hands NGO database...');

  // 1. Seed Super Admin
  const adminUsername = process.env.ADMIN_USER || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SuperSecretAdminPassword123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { passwordHash: hashedPassword },
    create: {
      username: adminUsername,
      passwordHash: hashedPassword,
      role: AdminRole.SUPER_ADMIN,
      forcePasswordChange: true,
    },
  });
  console.log(`Admin user seeded: ${admin.username}`);



  // 3. Seed Events
  const eventsData = [
    {
      title: 'Environmental Awareness Program & 500 Sapling Distribution',
      description: 'Insightful awareness program at Valavanthan Kottai Panchayat featuring talks by Mrs. M. Saranya (Assistant Director of Horticulture) and Mr. Nedunchelian (Environmental Social Activist). Mr. K.P. Sakthivel distributed 500 fruit saplings to promote sustainable practices and green future.',
      date: new Date('2024-11-29T10:00:00Z'),
      venue: 'Valavanthan Kottai Panchayat, Trichy',
      category: 'Environment',
      capacity: 250,
      status: EventStatus.PAST,
      imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2- SAFE.jpeg',
    },
    {
      title: 'Empowering Schools with Tree Plantation Material',
      description: 'Distributed tree plantation materials (pick axes, shovels, saplings) to 15 schools across Trichy block to encourage youth engagement in environmental greening projects.',
      date: new Date('2024-10-16T09:30:00Z'),
      venue: '15 Partner Schools, Trichy Block',
      category: 'Education & Environment',
      capacity: 150,
      status: EventStatus.PAST,
      imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/EMPOWERING-SAFE-3.jpg',
    },
    {
      title: 'Biodiversity Campaign across 15 Villages',
      description: 'Broad awareness campaign distributing posters, leaflets, and auto vehicle announcements in 15 villages across Thiruverumbur block to promote collective action for nature conservation.',
      date: new Date('2024-09-24T09:00:00Z'),
      venue: 'Thiruverumbur Block, Trichy',
      category: 'Community Campaign',
      capacity: 500,
      status: EventStatus.PAST,
      imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/BIO-SAFE-2.jpeg',
    },
    {
      title: 'Vermicomposting & Kitchen Garden School Workshop',
      description: 'Hands-on practical session teaching school children vermicomposting and kitchen garden cultivation for sustainable organic waste management.',
      date: new Date('2024-08-12T10:00:00Z'),
      venue: 'Panchayat Union Middle School, Oorathipatti',
      category: 'Education',
      capacity: 120,
      status: EventStatus.PAST,
      imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/vermi_zO7fKuH_M0LXXtX.jpeg',
    },
    {
      title: 'Upcoming National Single Women Livelihood Summit 2026',
      description: 'Statewide empowerment conference bringing together single women, legal experts, and social welfare leaders to discuss financial independence schemes and dignity in livelihoods.',
      date: new Date('2026-11-15T10:00:00Z'),
      venue: 'Arun Hotel Conference Hall, Trichy',
      category: 'Women Empowerment',
      capacity: 300,
      status: EventStatus.UPCOMING,
      imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/single women state level conference_rZkh6tW.jpg',
    },
  ];

  for (const ev of eventsData) {
    const existing = await prisma.event.findFirst({ where: { title: ev.title } });
    if (!existing) {
      await prisma.event.create({ data: ev });
    }
  }
  console.log('Events seeded.');

  // 4. Seed Reports
  const reportsData = [
    {
      title: 'Annual Report 2025-2026',
      year: '2025-2026',
      category: 'Annual',
      pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2d9acb2ca6.pdf',
      fileSize: '2.4 MB',
    },
    {
      title: 'Audit Report 2025',
      year: '2025',
      category: 'Audit',
      pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/c439129fef.pdf',
      fileSize: '1.8 MB',
    },
    {
      title: 'Audit Report 2024',
      year: '2024',
      category: 'Audit',
      pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/9cb777dc9b.pdf',
      fileSize: '1.5 MB',
    },
    {
      title: 'Audit Report 2023',
      year: '2023',
      category: 'Audit',
      pdfUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/b9069d9a66.pdf',
      fileSize: '1.6 MB',
    },
  ];

  for (const rep of reportsData) {
    const existing = await prisma.report.findFirst({ where: { title: rep.title } });
    if (!existing) {
      await prisma.report.create({ data: rep });
    }
  }
  console.log('Reports seeded.');

  // 5. Seed Certificates
  const certificatesData = [
    {
      name: '12A Registration Certificate',
      category: '12A',
      issuingBody: 'Income Tax Department, Govt of India',
      year: 'Statutory',
    },
    {
      name: '80-G Tax Exemption Certificate',
      category: '80G',
      issuingBody: 'Income Tax Department, Govt of India',
      year: 'Statutory',
    },
    {
      name: 'CSR Registration Certificate (Form CSR-1)',
      category: 'CSR',
      issuingBody: 'Ministry of Corporate Affairs',
      year: 'Statutory',
    },
    {
      name: 'FCRA Registration Certificate',
      category: 'FCRA',
      issuingBody: 'Ministry of Home Affairs, Govt of India',
      year: 'Statutory',
    },
  ];

  for (const cert of certificatesData) {
    const existing = await prisma.certificate.findFirst({ where: { name: cert.name } });
    if (!existing) {
      await prisma.certificate.create({ data: cert });
    }
  }
  console.log('Certificates seeded.');

  console.log('Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
