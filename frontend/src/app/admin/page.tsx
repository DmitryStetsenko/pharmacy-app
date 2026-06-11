import AdminPage from '@/pages-flat/admin/ui/AdminPage';

export const metadata = {
  title: 'Адміністрування | Pharmacy App',
  description: 'Панель адміністратора — управління користувачами та замовленнями',
};

export default function AdminRoute() {
  return <AdminPage />;
}
