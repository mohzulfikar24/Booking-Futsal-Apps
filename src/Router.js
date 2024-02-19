import { createBrowserRouter } from 'react-router-dom';

// import pages
import Lapangan from './pages/Lapangan';
import Home from './pages/Home';
import Profile from './pages/Customer/Profile';
import PaymentCustomer from './pages/Customer/Payment';
import HistoryCustomer from './pages/Customer/History';

import FieldOwner from './pages/Owner/AddField';
import EditField from './pages/Owner/EditField';

import { PrivateRoute } from './helper/PrivateRoute';
import Dashboard from './pages/Dashboard';
import { ProtectedAuth } from './helper/ProtectedAuth';
import MainLayout from './components/MainLayout';
import PaymentOwner from './pages/Owner/PaymentOwner';

import VerifyEmail from './helper/VerifyEmail';
import SuspendPage from './pages/Admin/Suspend';
import ManagementPage from './pages/Admin/Management';

// routernya
const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/profile', element: <Profile /> },
          { path: '/editlapangan', element: <EditField /> },
          { path: '/lapangan', element: <Lapangan /> },
          { path: '/lapangan/:id', element: <PaymentCustomer /> },
          { path: '/historypayment', element: <HistoryCustomer /> },
          { path: '/fields', element: <FieldOwner /> },
          { path: '/paymentowner', element: <PaymentOwner /> },
          { path: '/suspend-account', element: <SuspendPage /> },
          { path: '/management', element: <ManagementPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/lapanganview', element: <Lapangan /> },
          { path: '/lapanganview/:id', element: <PaymentCustomer /> },
        ],
      },
    ],
  },
  {
    children: [{ path: '/auth/:id', element: <VerifyEmail /> }],
  },
]);

export default router;
