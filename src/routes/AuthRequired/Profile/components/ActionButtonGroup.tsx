import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { RouteID } from 'routes';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import Button from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import { UserAPI } from 'api/users';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export interface ActionButtonGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function ActionButtonGroup({
  className,
  ...props
}: ActionButtonGroupProps): ReactElement {
  const { t } = useTranslation(RouteID.Profile, { keyPrefix: 'actionButtonGroup' });

  const navigate = useNavigate();

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  function handleLogoutAllClick(): void {
    showConfirmModal({
      title: t('logoutAllModal.title'),
      text: t('logoutAllModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await UserAPI.logoutAll();

        if (!response.ok) {
          createMessageToast({
            message: t('logoutAllModal.messages.logoutAll.error'),
            level: 'error',
          });
          setLoadingConfirmModal(false);
        }

        hideConfirmModal();
        createMessageToast({
          message: t('logoutAllModal.messages.logoutAll.success'),
          level: 'success',
        });
        navigate(reverse(RouteID.Home));
      },
      onCancel: null,
    });
  }

  function handleDeleteClick(): void {
    showConfirmModal({
      title: t('deleteModal.title'),
      text: t('deleteModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await UserAPI.delete();

        if (!response.ok) {
          createMessageToast({
            message: t('deleteModal.messages.delete.error'),
            level: 'error',
          });
          setLoadingConfirmModal(false);
        }

        hideConfirmModal();
        createMessageToast({
          message: t('deleteModal.messages.delete.success'),
          level: 'success',
        });
        navigate(reverse(RouteID.Home));
      },
      onCancel: null,
    });
  }

  return (
    <div {...props} className={cn('flex', 'flex-col', 'gap-1', className)}>
      <Button
        size='sm'
        variant='dark'
        className='w-full'
        onClick={handleLogoutAllClick}
      >
        {t('logoutAllButton')}
      </Button>
      <Button size='sm' variant='danger' className='w-full' onClick={handleDeleteClick}>
        {t('deleteButton')}
      </Button>
    </div>
  );
}

export default ActionButtonGroup;
