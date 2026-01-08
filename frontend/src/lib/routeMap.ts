export const routeMap: Record<
  string,
  {
    label: string;
    parent?: string;
  }
> = {
  '/dashboard': {
    label: 'Dashboard',
  },

  '/booking': {
    label: 'Reservasi Parkir',
    parent: '/dashboard',
  },

  '/booking/create': {
    label: 'Booking',
    parent: '/booking',
  },

  '/reservasi': {
    label: 'Reservasi Saya',
    parent: '/dashboard',
  },

  '/profile': {
    label: 'Profil',
    parent: '/dashboard',
  },
};
