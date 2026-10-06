import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/providers/LanguageContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileDonateBar from '@/components/layout/MobileDonateBar';

export const metadata: Metadata = {
  title: 'Safe Hands Human Resources Organization | NGO in Trichy, Tamil Nadu',
  description:
    'Safe Hands Human Resources Organization (SHHRO) is a premier non-governmental organization at 6/89, Periyar Nagar, Valavanthan Kottai, Trichy - 620015, dedicated to education, skill development, healthcare advocacy, environmental sustainability, and women empowerment.',
  keywords: [
    'Safe Hands NGO',
    'Safe Hands Human Resources Organization',
    'Trichy NGO',
    'Valavanthan Kottai NGO',
    'Tamil Nadu NGO',
    'Women Empowerment Trichy',
    'Environmental Sustainability Trichy',
    '80G Tax Exemption NGO',
  ],
  openGraph: {
    title: 'Safe Hands Human Resources Organization | Trichy NGO',
    description:
      'Empowering vulnerable and marginalized communities through education, skill development, healthcare, and environmental sustainability in Trichy.',
    url: 'https://safehandsindia.in',
    siteName: 'Safe Hands Human Resources Organization',
    images: [
      {
        url: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-04-08%20at%2016.20.40_6acd279f.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD Organization Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Safe Hands Human Resources Organization',
    alternateName: 'SHHRO',
    url: 'https://safehandsindia.in',
    logo: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-04-08%20at%2016.20.40_6acd279f.jpg',
    foundingDate: '2010',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '6/89, Periyar Nagar, Valavanthan Kottai',
      addressLocality: 'Trichy',
      addressRegion: 'Tamil Nadu',
      postalCode: '620015',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-7358005444',
      contactType: 'customer service',
      email: 'safehandsindia2010@gmail.com',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61568720233041',
      'https://x.com/SafeHandsNgo',
      'https://www.instagram.com/safehands_ngo/',
      'https://www.linkedin.com/in/safe-hands-ngo-2481b7319/',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/WhatsApp%20Image%202025-04-08%20at%2016.20.40_6acd279f.jpg" />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        <LanguageProvider>
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileDonateBar />
        </LanguageProvider>
      </body>
    </html>
  );
}
