import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function useNavigationMenu() {
  const profile = useSelector((state) => state.auth.profile);

  return useMemo(() => {
    const commonItems = [
      { to: '/dashboard', label: 'Dashboard' },
    ];

    if (profile.role === 'customer') {
      return [
        ...commonItems,
        { to: '/profile', label: 'Profile' },
        { to: '/lapangan', label: 'Booking Fields' },
        // { to: '/lapangan', label: 'Detail Fields' },
        { to: '/historypayment', label: 'History Payment' },
      ];
    } else if (profile.role === 'owner') {
      return [
        ...commonItems,
        { to: '/profile', label: 'Profile' },
        { to: '/fields', label: 'Fields' },
        { to: '/paymentowner', label: 'Payment' },
      ];
    } else if (profile.role === 'admin') {
      return [
        ...commonItems,
        { to: '/suspend-account', label: 'Suspend Account' },
        { to: '/management', label: 'Management' },
      ];
    }

    return null;
  }, [profile.role]);
}
