import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { RandomizerAPI } from 'api/telegram-bots/randomizer';

import type { FormValues } from '..';
import { useRandomizerOffcanvasStore } from '../store';

const OffcanvasContent = lazy(() => import('./OffcanvasContent'));

export interface OffcanvasInnerProps extends Omit<
  OffcanvasProps,
  'show' | 'loading' | 'children'
> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'randomizerOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const randomizerID = useRandomizerOffcanvasStore((state) => state.randomizerID);
  const action = useRandomizerOffcanvasStore((state) => state.action);
  const show = useRandomizerOffcanvasStore((state) => state.show);
  const loading = useRandomizerOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useRandomizerOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useRandomizerOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!randomizerID) return;
    (async () => {
      const response = await RandomizerAPI.get({ botID, id: randomizerID });

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getRandomizer.error'),
          level: 'error',
        });
        return;
      }

      const { id, ...randomizer } = response.json;

      setValues(randomizer);
      setLoading(false);
    })();
  }, [botID, randomizerID]);

  function handleHide(): void {
    hideOffcanvas();
    onHide?.();
  }

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={handleHide}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {t('title', { context: action === 'edit' ? 'edit' : 'add' })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Suspense fallback={<Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
