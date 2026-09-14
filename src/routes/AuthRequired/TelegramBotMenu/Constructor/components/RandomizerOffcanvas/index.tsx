import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import {
  DiagramRandomizerAPI,
  RandomizerAPI,
  RandomizersAPI,
} from 'api/telegram-bots/randomizer';
import type { Randomizer } from 'api/telegram-bots/randomizer/types';

import { useRandomizerOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
};

export interface RandomizerOffcanvasProps extends OffcanvasInnerProps {}

function RandomizerOffcanvas(props: RandomizerOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'randomizerOffcanvas',
  });

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const randomizerID = useRandomizerOffcanvasStore((state) => state.id);
  const action = useRandomizerOffcanvasStore((state) => state.action);
  const hideOffcanvas = useRandomizerOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<Randomizer, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addRandomizer.success'),
          error: t('messages.addRandomizer.error'),
        },
        edit: {
          success: t('messages.editRandomizer.success'),
          error: t('messages.editRandomizer.error'),
        },
      },
      type: 'randomizer',
      action,
      saveAPICall: (values) =>
        action === 'edit' && randomizerID
          ? RandomizerAPI.update({ botID, id: randomizerID, data: values })
          : RandomizersAPI.create({ botID, data: values }),
      diagramAPICall: (id) => DiagramRandomizerAPI.get({ botID, id }),
      onHide: () => hideOffcanvas(),
    }),
    [i18n.language, botID, randomizerID, action, hideOffcanvas],
  );

  return (
    <Formik
      initialValues={defaultFormValues}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      <OffcanvasInner {...props} />
    </Formik>
  );
}

export default memo(RandomizerOffcanvas);
