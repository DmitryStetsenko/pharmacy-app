import { Suspense } from "react";
import { CatalogPage } from "@/pages-flat/catalog/ui/CatalogPage";

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function Catalog({ searchParams }: PageProps) {
  const { category, search, page } = await searchParams;
  
  let medicines = [];
  try {
    const pageNum = parseInt(page || '1', 10);
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (search) query.append('search', search);
    query.append('page', pageNum.toString());
    query.append('limit', '6'); // має відповідати ліміту в CatalogPage

    const res = await fetch(`${API_URL}/medicines?${query.toString()}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      medicines = data.medicines || [];
    }
  } catch (error) {
    // ігноруємо помилки для стабільності під час збірки
  }

  // Створюємо ItemList JSON-LD розмітку для списку товарів у каталозі
  const jsonLd = medicines.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'numberOfItems': medicines.length,
    'itemListElement': medicines.map((med: any, index: number) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': med.name,
        'image': med.image || '',
        'description': med.description,
        'sku': med.id,
        'brand': {
          '@type': 'Brand',
          'name': med.manufacturer || 'Аптека Здоров\'я'
        },
        'offers': {
          '@type': 'Offer',
          'priceCurrency': 'UAH',
          'price': med.price,
          'availability': med.inStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          'itemCondition': 'https://schema.org/NewCondition'
        }
      }
    }))
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Suspense fallback={<div>Завантаження каталогу...</div>}>
        <CatalogPage />
      </Suspense>
    </>
  );
}

