import { MetadataRoute } from 'next';
import { services } from '@/lib/data/services';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://illusiontech.dev';

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

  // Dynamic service pages from lib/services
  const serviceRoutes = services
    .filter((service) => service.link !== '/services/website-design') // Filter out non-existent page
    .map((service) => ({
      url: `${siteUrl}${service.link.split('#')[0]}`, // Remove hash from link
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

  // Combine and create unique routes
  const allRoutes = [...staticRoutes, ...serviceRoutes];
  const uniqueRoutes = Array.from(new Map(allRoutes.map((item) => [item.url, item])).values());

  return uniqueRoutes;
}