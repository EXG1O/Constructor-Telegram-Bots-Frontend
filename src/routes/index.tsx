import { RouteObject } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

export const routes: RouteObject[] = [
	{
		id: 'languages',
		async lazy() {
			const loader = await import('./Languages/loader');

			return { loader: loader.default };
		},
		children: [
			{
				id: 'root',
				path: '/',
				ErrorBoundary,
				async lazy() {
					const module = await import('./Root');

					return {
						Component: module.default,
						loader: module.loader,
					};
				},
				shouldRevalidate: () => true,
				children: [
					{
						id: 'home',
						index: true,
						async lazy() {
							const module = await import('./Home');

							return {
								Component: module.default,
								loader: module.loader,
							};
						},
					},
					{
						id: 'updates',
						path: 'updates/',
						async lazy() {
							const module = await import('./Updates');

							return {
								Component: module.default,
								loader: module.loader,
							};
						},
					},
					{
						path: 'donation/',
						children: [
							{
								id: 'donation-index',
								index: true,
								async lazy() {
									const module = await import('./Donation/Index');

									return {
										Component: module.default,
										loader: module.loader,
									};
								},
							},
							{
								id: 'donation-completed',
								path: 'completed/',
								async lazy() {
									const module = await import('./Donation/Completed');

									return { Component: module.default };
								},
							},
						],
					},
					{
						id: 'instruction',
						path: 'instruction/',
						async lazy() {
							const module = await import('./Instruction');

							return {
								Component: module.default,
								loader: module.loader,
							};
						},
					},
					{
						id: 'privacy-policy',
						path: 'privacy-policy/',
						async lazy() {
							const module = await import('./PrivacyPolicy');

							return {
								Component: module.default,
								loader: module.loader,
							};
						},
					},
					{
						async lazy() {
							const module = await import('./AuthRequired/Root');

							return { Component: module.default };
						},
						children: [
							{
								id: 'telegram-bots',
								path: 'telegram-bots/',
								async lazy() {
									const module = await import(
										'./AuthRequired/TelegramBots'
									);

									return {
										Component: module.default,
										loader: module.loader,
									};
								},
							},
							{
								id: 'telegram-bot-menu-root',
								path: 'telegram-bot-menu/:telegramBotID/',
								async lazy() {
									const module = await import(
										'./AuthRequired/TelegramBotMenu/Root'
									);

									return { loader: module.loader };
								},
								shouldRevalidate: () => true,
								children: [
									{
										id: 'telegram-bot-menu-index',
										index: true,
										async lazy() {
											const module = await import(
												'./AuthRequired/TelegramBotMenu/Index'
											);

											return { Component: module.default };
										},
									},
									{
										id: 'telegram-bot-menu-variables',
										path: 'variables/',
										async lazy() {
											const module = await import(
												'./AuthRequired/TelegramBotMenu/Variables'
											);

											return {
												Component: module.default,
												loader: module.loader,
											};
										},
									},
									{
										id: 'telegram-bot-menu-users',
										path: 'users/',
										async lazy() {
											const module = await import(
												'./AuthRequired/TelegramBotMenu/Users'
											);

											return {
												Component: module.default,
												loader: module.loader,
											};
										},
									},
									{
										id: 'telegram-bot-menu-database',
										path: 'database/',
										async lazy() {
											const module = await import(
												'./AuthRequired/TelegramBotMenu/Database'
											);

											return {
												Component: module.default,
												loader: module.loader,
											};
										},
									},
									{
										id: 'telegram-bot-menu-constructor',
										path: 'constructor/',
										async lazy() {
											const module = await import(
												'./AuthRequired/TelegramBotMenu/Constructor'
											);

											return {
												Component: module.default,
												loader: module.loader,
											};
										},
									},
								],
							},
						],
					},
					{
						path: '*',
						async lazy() {
							const module = await import('./NotFound');

							return { loader: module.loader };
						},
					},
				],
			},
		],
	},
];

export function reverse(id: string, params?: Record<string, string | number>): string {
	const buildPath = (routes: RouteObject[], basePath: string = ''): string | null => {
		for (const route of routes) {
			let currentPath: string = basePath;

			if (route.path) {
				if (route.path.startsWith('/')) {
					currentPath = route.path;
				} else {
					currentPath += route.path;
				}
			}

			if (route.id === id) {
				return currentPath;
			}

			if (route.children) {
				const childPath: string | null = buildPath(route.children, currentPath);

				if (childPath) {
					return childPath;
				}
			}
		}

		return null;
	};

	let path: string | null = buildPath(routes);

	if (!path) {
		throw new Error(`Route with id="${id}" not found.`);
	}

	if (params) {
		for (const key in params) {
			path = path.replace(`:${key}`, params[key].toString());
		}
	}

	return path.replace(/\/:\w+\?/g, '');
}
