import { redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { SectionsAPI } from 'api/instruction';
import type { APIResponse } from 'api/instruction/types';

import reverse from 'utils/reverse';

export interface LoaderData {
  sections: APIResponse.SectionsAPI.Get;
}

async function loader(): Promise<LoaderData> {
  const response = await SectionsAPI.get();

  if (!response.ok) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { sections: response.json };
}

export default loader;
