import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { Randomizer } from 'api';
import { TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
import { useRandomizerOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
};

export interface RandomizerOffcanvasProps extends OffcanvasInnerProps {}

function RandomizerOffcanvas(props: RandomizerOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'randomizerOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const randomizerID = useRandomizerOffcanvasStore((state) => state.id);
  const action = useRandomizerOffcanvasStore((state) => state.action);
  const hideOffcanvas = useRandomizerOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useBlockFormikSubmit<Randomizer, FormValues>(
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
      type: NodeType.Randomizer,
      action,
      saveBlock: (values) =>
        action === 'edit' && randomizerID
          ? TelegramBotsService.updateRandomizer({
              path: { telegramBotId: botID, id: randomizerID },
              body: values,
            })
          : TelegramBotsService.createRandomizer({
              path: { telegramBotId: botID },
              body: values,
            }),
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramRandomizer({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, randomizerID, action, hideOffcanvas, i18n.language],
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
