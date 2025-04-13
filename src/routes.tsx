import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from './pages/_layouts/app';
import { AppAuth } from './pages/_layouts/auth';
import { NotFound } from './pages/404';
import { Dashboard } from './pages/app/dashboard/dashboard';
import { Orders } from './pages/app/orders/orders';
import { SignUp } from './pages/auth/sign-up';
import { SignIn } from './pages/auth/sing-in';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/orders', element: <Orders /> }
    ]
  },

  {
    path: '/',
    element: <AppAuth />,
    children: [
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> }
    ]
  }
]);
