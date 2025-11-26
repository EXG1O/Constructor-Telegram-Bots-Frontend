import { RouteObject } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';

export enum RouteID {
  Root = 'root',
  Login = 'login',
  Home = 'home',
  Donation = 'donation-index',
  DonationCompleted = 'donation-completed',
  Instruction = 'instruction',
  PrivacyPolicy = 'privacy-policy',
  TelegramBots = 'telegram-bots',
  TelegramBotMenuRoot = 'telegram-bot-menu-root',
  TelegramBotMenuVariables = 'telegram-bot-menu-variables',
  TelegramBotMenuUsers = 'telegram-bot-menu-users',
  TelegramBotMenuDatabase = 'telegram-bot-menu-database',
  TelegramBotMenuConstructor = 'telegram-bot-menu-constructor',
}

export const routes: RouteObject[] = [
  {
    id: RouteID.Root,
    path: '/',
    ErrorBoundary,
    async lazy() {
      const [component, loader] = await Promise.all([
        await import('./Root'),
        await import('./Root/loader'),
      ]);

      return {
        Component: component.default,
        loader: loader.default,
      };
    },
    shouldRevalidate: () => true,
    children: [
      {
        id: RouteID.Login,
        path: 'login/',
        async lazy() {
          const [component, loader] = await Promise.all([
            await import('./Login'),
            await import('./Login/loader'),
          ]);

          return {
            Component: component.default,
            loader: loader.default,
          };
        },
      },
      {
        id: RouteID.Home,
        index: true,
        async lazy() {
          const [component, loader] = await Promise.all([
            await import('./Home'),
            await import('./Home/loader'),
          ]);

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
              const [component, loader] = await Promise.all([
                await import('./Donation/Index'),
                await import('./Donation/Index/loader'),
              ]);

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
          const [component, loader] = await Promise.all([
            await import('./Instruction'),
            await import('./Instruction/loader'),
          ]);

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
          const [component, loader] = await Promise.all([
            await import('./PrivacyPolicy'),
            await import('./PrivacyPolicy/loader'),
          ]);

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
              const [component, loader] = await Promise.all([
                await import('./AuthRequired/TelegramBots'),
                await import('./AuthRequired/TelegramBots/loader'),
              ]);

              return {
                Component: component.default,
                loader: loader.default,
              };
            },
          },
          {
            id: RouteID.TelegramBotMenuRoot,
            path: 'telegram-bot-menu/:telegramBotID/',
            async lazy() {
              const loader = await import('./AuthRequired/TelegramBotMenu/Root/loader');

              return { loader: loader.default };
            },
            shouldRevalidate: () => true,
            children: [
              {
                id: RouteID.TelegramBotMenuVariables,
                path: 'variables/',
                async lazy() {
                  const [component, loader] = await Promise.all([
                    await import('./AuthRequired/TelegramBotMenu/Variables'),
                    await import('./AuthRequired/TelegramBotMenu/Variables/loader'),
                  ]);

                  return {
                    Component: component.default,
                    loader: loader.default,
                  };
                },
              },
              {
                id: RouteID.TelegramBotMenuUsers,
                path: 'users/',
                async lazy() {
                  const [component, loader] = await Promise.all([
                    await import('./AuthRequired/TelegramBotMenu/Users'),
                    await import('./AuthRequired/TelegramBotMenu/Users/loader'),
                  ]);

                  return {
                    Component: component.default,
                    loader: loader.default,
                  };
                },
              },
              {
                id: RouteID.TelegramBotMenuDatabase,
                path: 'database/',
                async lazy() {
                  const [component, loader] = await Promise.all([
                    await import('./AuthRequired/TelegramBotMenu/Database'),
                    await import('./AuthRequired/TelegramBotMenu/Database/loader'),
                  ]);

                  return {
                    Component: component.default,
                    loader: loader.default,
                  };
                },
              },
              {
                id: RouteID.TelegramBotMenuConstructor,
                path: 'constructor/',
                async lazy() {
                  const [component, loader] = await Promise.all([
                    await import('./AuthRequired/TelegramBotMenu/Constructor'),
                    await import('./AuthRequired/TelegramBotMenu/Constructor/loader'),
                  ]);

                  return {
                    Component: component.default,
                    loader: loader.default,
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
          const loader = await import('./NotFound/loader');

          return { loader: loader.default };
        },
      },
    ],
  },
];
