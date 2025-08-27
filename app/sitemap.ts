import { MetadataRoute } from 'next';
import { connectToDB } from '@/lib/mongoose';
import ServiceModel from '@/lib/models/Service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';
  await connectToDB();

  // Main static pages
  const staticRoutes = [
    '', // Homepage
    '/about',
    '/services',
    // Assuming a /contact page exists or will exist. If not, this can be removed.
    '/contact',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic service pages from the database
  // Only fetch services that have a 'link' field to prevent errors with services that might not have one.
  const servicesFromDB = await ServiceModel.find({ link: { $exists: true, $ne: null } }).select('link updatedAt').lean();

  const serviceRoutes = servicesFromDB.map((service) => ({
    // Ensure the link is a full URL and remove any potential hash fragments
    url: `${siteUrl}${service.link!.split('#')[0]}`,
    // Use the service's updatedAt field for more accurate lastModified, or fallback to now
    lastModified: service.updatedAt ? new Date(service.updatedAt).toISOString() : new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Combine and create unique routes
  const allRoutes = [...staticRoutes, ...serviceRoutes];
  const uniqueRoutes = Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());

  return uniqueRoutes;
}