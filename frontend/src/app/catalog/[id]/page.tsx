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
  return <MedicineDetailsPage id={id} />;
}
