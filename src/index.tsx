import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'styles/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.scss';

import { routes } from './routes';

const router = createBrowserRouter(routes);

createRoot(document.querySelector<HTMLDivElement>('#root')!).render(
	<RouterProvider router={router} />,
);
