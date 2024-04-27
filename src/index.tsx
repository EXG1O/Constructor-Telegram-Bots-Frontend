import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'styles/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.scss';

import ErrorBoundary from 'routes/ErrorBoundary';

const router = createBrowserRouter([{
	id: 'languages',
	async lazy() {
		const module = await import('./routes/Languages');

		return { loader: module.loader };
	},
	children: [{
		id: 'root',
		path: '/',
		ErrorBoundary,
		async lazy() {
			const module = await import('./routes/Root');

			return {
				Component: module.default,
				loader: module.loader,
			}
		},
		shouldRevalidate: () => true,
		children: [
			{
				id: 'login',
				path: 'login/:userID/:confirmCode/',
				async lazy() {
					const module = await import('./routes/Login');

					return {
						Component: module.default,
						loader: module.loader,
					}
				},
			},
			{
				id: 'home',
				index: true,
				async lazy() {
					const module = await import('./routes/Home');

					return {
						Component: module.default,
						loader: module.loader,
					}
				},
			},
			{
				id: 'updates',
				path: 'updates/',
				async lazy() {
					const module = await import('./routes/Updates');

					return {
						Component: module.default,
						loader: module.loader,
					}
				},
			},
			{
				path: 'donation/',
				children: [
					{
						id: 'donation-index',
						index: true,
						async lazy() {
							const module = await import('./routes/Donation/Index');

							return {
								Component: module.default,
								loader: module.loader,
							}
						},
					},
					{
						path: 'completed/',
						async lazy() {
							const module = await import('./routes/Donation/Completed');

							return { Component: module.default };
						},
					},
				],
			},
			{
				id: 'instruction',
				path: 'instruction/',
				async lazy() {
					const module = await import('./routes/Instruction');

					return {
						Component: module.default,
						loader: module.loader,
					}
				},
			},
			{
				id: 'privacy-policy',
				path: 'privacy-policy/',
				async lazy() {
					const module = await import('./routes/PrivacyPolicy');

					return {
						Component: module.default,
						loader: module.loader,
					}
				},
			},
			{
				async lazy() {
					const module = await import('./routes/AuthRequired/Root');

					return { Component: module.default };
				},
				children: [
					{
						id: 'personal-cabinet',
						path: 'personal-cabinet/',
						async lazy() {
							const module = await import('./routes/AuthRequired/PersonalCabinet');

							return {
								Component: module.default,
								loader: module.loader,
							}
						},
					},
					{
						id: 'telegram-bot-menu-root',
						path: 'telegram-bot-menu/:telegramBotID/',
						async lazy() {
							const module = await import('./routes/AuthRequired/TelegramBotMenu/Root');

							return {
								Component: module.default,
								loader: module.loader,
							}
						},
						shouldRevalidate: () => true,
						children: [
							{
								id: 'telegram-bot-menu-index',
								index: true,
								async lazy() {
									const module = await import('./routes/AuthRequired/TelegramBotMenu/Index');

									return { Component: module.default };
								},
							},
							{
								id: 'telegram-bot-menu-variables',
								path: 'variables/',
								async lazy() {
									const module = await import('./routes/AuthRequired/TelegramBotMenu/Variables');

									return {
										Component: module.default,
										loader: module.loader,
									}
								},
							},
							{
								id: 'telegram-bot-menu-users',
								path: 'users/',
								async lazy() {
									const module = await import('./routes/AuthRequired/TelegramBotMenu/Users');

									return {
										Component: module.default,
										loader: module.loader,
									}
								},
							},
							{
								id: 'telegram-bot-menu-database',
								path: 'database/',
								async lazy() {
									const module = await import('./routes/AuthRequired/TelegramBotMenu/Database');

									return {
										Component: module.default,
										loader: module.loader,
									}
								},
							},
							{
								id: 'telegram-bot-menu-constructor',
								path: 'constructor/',
								async lazy() {
									const module = await import('./routes/AuthRequired/TelegramBotMenu/Constructor');

									return {
										Component: module.default,
										loader: module.loader,
									}
								},
							},
						],
					},
				],
			},
			{
				path: '*',
				async lazy() {
					const module = await import('./routes/NotFound');

					return { Component: module.default };
				},
			},
		],
	}],
}]);

createRoot(document.querySelector<HTMLDivElement>('#root')!).render(<RouterProvider router={router} />);