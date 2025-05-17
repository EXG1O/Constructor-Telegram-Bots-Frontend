import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'styles/bootstrap.scss';
import './index.css';

import './i18n';
import { routes } from './routes';

const router = createBrowserRouter(routes);

createRoot(document.querySelector<HTMLDivElement>('#root')!).render(
  <RouterProvider router={router} />,
);
