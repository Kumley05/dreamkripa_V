import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.dreamkripa.com';

  const routes = [
    '',
    '/about',
    '/programs',
    '/apply',
    '/blog',
    '/careers',
    '/contact',
    '/faq',
    '/support',
    '/colleges/iibs-bangalore',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/programs' || route === '/apply' ? 0.9 : 0.7,
  }));
}