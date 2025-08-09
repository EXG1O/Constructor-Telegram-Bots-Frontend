import { RouteObject } from 'react-router-dom';

import { routes } from 'routes';

function reverse(id: string, params?: Record<string, string | number>): string {
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

export default reverse;
