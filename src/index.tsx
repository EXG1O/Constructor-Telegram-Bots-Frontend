import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from 'routes';

import './index.css';

import 'i18n';
import 'api';

const router = createBrowserRouter(routes);
createRoot(document.querySelector<HTMLDivElement>('#root')!).render(
  <RouterProvider router={router} />,
);
