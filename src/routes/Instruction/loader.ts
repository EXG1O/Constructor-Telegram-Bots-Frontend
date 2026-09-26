import { redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Section } from 'api';
import { InstructionService } from 'api';

import reverse from 'utils/reverse';

export interface LoaderData {
  sections: Section[];
}

async function loader(): Promise<LoaderData> {
  const { data, error } = await InstructionService.getSectionList();

  if (error || !data) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { sections: data };
}

export default loader;
