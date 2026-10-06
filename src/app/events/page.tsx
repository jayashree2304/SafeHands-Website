import React from 'react';
import { prisma } from '@/lib/db/prisma';
import EventsClient from './EventsClient';

export const revalidate = 0;

export const metadata = {
  title: 'Events | Safe Hands NGO',
  description: 'Upcoming & past community awareness events, tree plantation drives, and summit meetings by Safe Hands NGO.',
};

export default async function EventsPage() {
  let events: any[] = [];

  try {
    events = await prisma.event.findMany({
      where: { isDeleted: false },
      include: {
        _count: { select: { enrolments: true } },
      },
      orderBy: { date: 'desc' },
    });
  } catch (_) {
    // Fallback to default events if DB query unavailable
  }

  if (events.length === 0) {
    events = [
      {
        id: 'e1',
        title: 'Environmental Awareness Program & 500 Sapling Distribution',
        description: 'Insightful awareness program at Valavanthan Kottai Panchayat featuring talks by Mrs. M. Saranya (Assistant Director of Horticulture) and Mr. Nedunchelian (Environmental Social Activist). Mr. K.P. Sakthivel distributed 500 fruit saplings to promote sustainable practices and green future.',
        date: new Date('2024-11-29'),
        venue: 'Valavanthan Kottai Panchayat, Trichy',
        category: 'Environment',
        capacity: 250,
        status: 'PAST',
        imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/2-%20SAFE.jpeg',
        _count: { enrolments: 142 },
      },
      {
        id: 'e2',
        title: 'Empowering Schools with Tree Plantation Material',
        description: 'Distributed tree plantation materials (pick axes, shovels, saplings) to 15 schools across Trichy block to encourage youth engagement in environmental greening projects.',
        date: new Date('2024-10-16'),
        venue: '15 Partner Schools, Trichy Block',
        category: 'Education & Environment',
        capacity: 150,
        status: 'PAST',
        imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/EMPOWERING-SAFE-3.jpg',
        _count: { enrolments: 98 },
      },
      {
        id: 'e3',
        title: 'Biodiversity Campaign across 15 Villages',
        description: 'Broad awareness campaign distributing posters, leaflets, and auto vehicle announcements in 15 villages across Thiruverumbur block to promote collective action for nature conservation.',
        date: new Date('2024-09-24'),
        venue: 'Thiruverumbur Block, Trichy',
        category: 'Community Campaign',
        capacity: 500,
        status: 'PAST',
        imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/BIO-SAFE-2.jpeg',
        _count: { enrolments: 320 },
      },
      {
        id: 'e4',
        title: 'Upcoming National Single Women Livelihood Summit 2026',
        description: 'Statewide empowerment conference bringing together single women, legal experts, and social welfare leaders to discuss financial independence schemes and dignity in livelihoods.',
        date: new Date('2026-11-15'),
        venue: 'Arun Hotel Conference Hall, Trichy',
        category: 'Women Empowerment',
        capacity: 300,
        status: 'UPCOMING',
        imageUrl: 'https://1ngo.sgp1.digitaloceanspaces.com/media/safehandsindia/single%20women%20state%20level%20conference_rZkh6tW.jpg',
        _count: { enrolments: 45 },
      },
    ];
  }

  return <EventsClient initialEvents={events} />;
}
