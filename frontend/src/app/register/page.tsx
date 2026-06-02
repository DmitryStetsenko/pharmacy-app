import { RegisterPage } from '@/pages-flat/register';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Реєстрація | Аптека Здоров\'я',
  description: 'Реєстрація особистого кабінету в Аптеці Здоров\'я',
};

export default function Register() {
  return <RegisterPage />;
}
