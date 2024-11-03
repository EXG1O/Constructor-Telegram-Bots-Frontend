import { RouteObject } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

export enum RouteID {
	Root = 'root',
	Languages = 'languages',
	Home = 'home',
	Updates = 'updates',
	Donation = 'donation-index',
	DonationCompleted = 'donation-completed',
	Instruction = 'instruction',
	PrivacyPolicy = 'privacy-policy',
	TelegramBots = 'telegram-bots',
	TelegramBotMenu = 'telegram-bot-menu-root',
}

export const routes: RouteObject[] = [
	{
		id: RouteID.Languages,
		async lazy() {
			const loader = await import('./Languages/loader');

			return { loader: loader.default };
		},
		children: [
			{
				id: RouteID.Root,
				path: '/',
				ErrorBoundary,
				async lazy() {
					const component = await import('./Root');
					const loader = await import('./Root/loader');

					return {
						Component: component.default,
						loader: loader.default,
					};
				},
				shouldRevalidate: () => true,
				children: [
					{
						id: RouteID.Home,
						index: true,
						async lazy() {
							const component = await import('./Home');
							const loader = await import('./Home/loader');

							return {
								Component: component.default,
								loader: loader.default,
							};
						},
					},
					{
						id: RouteID.Updates,
						path: 'updates/',
						async lazy() {
							const component = await import('./Updates');
							const loader = await import('./Updates/loader');

							return {
								Component: component.default,
								loader: loader.default,
							};
						},
					},
					{
						path: 'donation/',
						children: [
							{
								id: RouteID.Donation,
								index: true,
								async lazy() {
									const component = await import('./Donation/Index');
									const loader = await import(
										'./Donation/Index/loader'
									);

									return {
										Component: component.default,
										loader: loader.default,
									};
								},
							},
							{
								id: RouteID.DonationCompleted,
								path: 'completed/',
								async lazy() {
									const module = await import('./Donation/Completed');

									return { Component: module.default };
								},
							},
						],
					},
					{
						id: RouteID.Instruction,
						path: 'instruction/',
						async lazy() {
							const component = await import('./Instruction');
							const loader = await import('./Instruction/loader');

							return {
								Component: component.default,
								loader: loader.default,
							};
						},
					},
					{
						id: RouteID.PrivacyPolicy,
						path: 'privacy-policy/',
						async lazy() {
							const component = await import('./PrivacyPolicy');
							const loader = await import('./PrivacyPolicy/loader');

							return {
								Component: component.default,
								loader: loader.default,
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
								id: RouteID.TelegramBots,
								path: 'telegram-bots/',
								async lazy() {
									const component = await import(
										'./AuthRequired/TelegramBots'
									);
									const loader = await import(
										'./AuthRequired/TelegramBots/loader'
									);

									return {
										Component: component.default,
										loader: loader.default,
									};
								},
							},
							{
								id: RouteID.TelegramBotMenu,
								path: 'telegram-bot-menu/:telegramBotID/',
								async lazy() {
									const loader = await import(
										'./AuthRequired/TelegramBotMenu/Root/loader'
									);

									return { loader: loader.default };
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
