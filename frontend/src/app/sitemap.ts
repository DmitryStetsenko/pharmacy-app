import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Базові статичні маршрути
  const routes = [
    '',
    '/catalog',
    '/about',
    '/symptoms',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Отримуємо всі медикаменти з бекенду для формування динамічного списку сторінок
    const res = await fetch(`${API_URL}/medicines`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const medicines = await res.json();
      const medicineRoutes = medicines.map((med: any) => ({
        url: `${SITE_URL}/catalog/${med.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      return [...routes, ...medicineRoutes];
    }
  } catch (error) {
    // Повертаємо хоча б статичні маршрути, якщо бекенд недоступний під час збірки
  }

  return routes;
}
