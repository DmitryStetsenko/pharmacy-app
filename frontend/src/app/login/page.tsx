import { LoginPage } from '@/pages-flat/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вхід | Аптека Здоров\'я',
  description: 'Вхід до особистого кабінету Аптеки Здоров\'я',
};

export default function Login() {
  return <LoginPage />;
}
