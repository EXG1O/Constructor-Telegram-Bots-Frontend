import React, { ReactElement, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import { UserAPI } from 'api/users';

import reverse from 'utils/reverse';

function AcceptTermsModal(): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'acceptTermsModal' });

  const location = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(
    () =>
      setShow(
        location.pathname !== reverse(RouteID.TermsOfService) &&
          location.pathname !== reverse(RouteID.PrivacyPolicy),
      ),
    [location.pathname],
  );

  function handleLink(): void {
    setShow(false);
  }

  async function handleAccept(): Promise<void> {
    setLoading(true);

    const response = await UserAPI.acceptTerms();

    if (!response.ok) {
      createMessageToast({ message: t('messages.acceptTerms.error'), level: 'error' });
      setLoading(false);
      return;
    }

    setShow(false);
    createMessageToast({
      message: t('messages.acceptTerms.success'),
      level: 'success',
    });
  }

  async function handleDecline(): Promise<void> {
    setLoading(true);

    const response = await UserAPI.delete();

    if (!response.ok) {
      createMessageToast({ message: t('messages.declineTerms.error'), level: 'error' });
      setLoading(false);
      return;
    }

    setShow(false);
    createMessageToast({
      message: t('messages.declineTerms.success'),
      level: 'success',
    });
    navigate(reverse(RouteID.Home));
  }

  return (
    <Modal show={show} loading={loading}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{t('title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-2'>
          <p className='text-foreground'>
            <Trans
              t={t}
              i18nKey='text'
              components={[
                <Link
                  key={0}
                  to={reverse(RouteID.TermsOfService)}
                  className='text-primary hover:text-primary-accent'
                  onClick={handleLink}
                />,
              ]}
            />
          </p>
          <p className='text-xs text-muted'>
            <Trans
              t={t}
              i18nKey='disclaimer'
              components={[
                <Link
                  key={0}
                  to={reverse(RouteID.PrivacyPolicy)}
                  className='text-primary-accent hover:text-primary-emphasis'
                  onClick={handleLink}
                />,
              ]}
            />
          </p>
        </Modal.Body>
        <Modal.Footer className='flex flex-nowrap gap-4'>
          <Button variant='success' className='w-full' onClick={handleAccept}>
            {t('acceptButton')}
          </Button>
          <Button variant='danger' className='w-full' onClick={handleDecline}>
            {t('declineButton')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default AcceptTermsModal;
