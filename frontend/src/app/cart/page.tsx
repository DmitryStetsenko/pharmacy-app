import { CartPage } from '@/pages-flat/cart';

export const metadata = {
  title: 'Кошик покупок | Аптека Здоров\'я',
  description: 'Перегляд обраних медикаментів, зміна кількості та перехід до оформлення замовлення.',
};

export default function Cart() {
  return <CartPage />;
}
