import type { Location, RouteObject } from 'react-router-dom';
import { generatePath } from 'react-router-dom';

import { routes } from 'routes';

import getLocationLanguage from './getLocationLanguage';

export interface ReverseOptions {
  params?: Record<string, any>;
  location?: Location;
}

function reverse(id: string, { params, location }: ReverseOptions = {}): string {
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

  const path: string | null = buildPath(routes);

  if (!path) {
    throw new Error(`Route with id="${id}" not found.`);
  }

  return generatePath(path, { lang: getLocationLanguage(location), ...params }).replace(
    /\/?$/,
    '/',
  );
}

export default reverse;
