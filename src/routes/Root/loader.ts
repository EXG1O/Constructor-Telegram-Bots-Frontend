import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import Language from 'enums/language';

import { RouteID } from 'routes';

import { type User, UsersService } from 'api';

import reverse from 'utils/reverse';

export interface LoaderData {
  user: User | null;
}

async function loader({ params: { lang } }: LoaderFunctionArgs): Promise<LoaderData> {
  if (lang && !Object.values(Language).includes(lang as any)) {
    throw redirect(reverse(RouteID.Home));
  }

  const { data } = await UsersService.getUser();

  return { user: data ?? null };
}

export default loader;
