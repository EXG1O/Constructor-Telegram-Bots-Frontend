import { redirect } from 'react-router-dom';
import i18n from 'i18n';
import type { TOptions } from 'i18next';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import reverse from 'utils/reverse';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.NotFound}`;
}

export type LoaderData = Response;

async function loader(): Promise<LoaderData> {
  await i18n.loadNamespaces(RouteID.NotFound);

  createMessageToast({
    message: i18n.t<string, StrictTOptions, string, StrictTOptions>('text', {
      ns: 'not-found',
    }),
    level: 'error',
  });

  return redirect(reverse(RouteID.Home));
}

export default loader;
