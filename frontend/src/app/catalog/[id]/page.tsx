import { MedicineDetailsPage } from '@/pages-flat/medicine-details';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/medicines/${id}`);
    if (res.ok) {
      const medicine = await res.json();
      return {
        title: `${medicine.name} | Аптека Здоров'я`,
        description: medicine.description,
        openGraph: {
          title: `${medicine.name} | Аптека Здоров'я`,
          description: medicine.description,
          type: 'website',
          images: medicine.image ? [{ url: medicine.image }] : [],
        }
      };
    }
  } catch (error) {
    // ігноруємо помилки
  }
  return {
    title: 'Деталі препарату | Аптека Здоров\'я',
    description: 'Детальна інформація про медичний препарат',
  };
}

export default async function MedicineDetails({ params }: PageProps) {
  const { id } = await params;
  
  let medicine = null;
  try {
    const res = await fetch(`${API_URL}/medicines/${id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      medicine = await res.json();
    }
  } catch (error) {
    // ігноруємо помилки для стабільності під час збірки
  }

  // Створення JSON-LD розмітки за стандартами schema.org/Product
  const jsonLd = medicine ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': medicine.name,
    'image': medicine.image || '',
    'description': medicine.description,
    'sku': medicine.id,
    'brand': {
      '@type': 'Brand',
      'name': medicine.manufacturer || 'Аптека Здоров\'я'
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'UAH',
      'price': medicine.price,
      'availability': medicine.inStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition'
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <MedicineDetailsPage id={id} />
    </>
  );
}

