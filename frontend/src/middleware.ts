import withAuth from 'next-auth/middleware';
export default withAuth;

export const config = {
  matcher: [
    '/checkout',
    // Сюди також можна додати сторінку замовлень чи профілю, коли ми їх створимо
  ],
};
