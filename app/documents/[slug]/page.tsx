import { notFound } from 'next/navigation';
import { getPriceBreakdownBySlug } from '@/lib/actions/priceBreakdown.actions';
import { PriceBreakdownDetail } from '@/components/public/PriceBreakdownDetail';
import type { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const breakdown = await getPriceBreakdownBySlug(params.slug);
  if (!breakdown) return { title: 'Not Found' };

  const title = `${breakdown.title} | ${breakdown.serviceId.name} | IllusionTech`;
  const description = breakdown.summary;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

export default async function PriceBreakdownPage({ params }: PageProps) {
  const breakdown = await getPriceBreakdownBySlug(params.slug);
  if (!breakdown) notFound();

  return <PriceBreakdownDetail breakdown={breakdown} />;
}
