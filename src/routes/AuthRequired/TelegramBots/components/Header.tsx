import React, { HTMLAttributes, ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';

import TelegramBotAdditionModal from './TelegramBotAdditionModal';

export interface HeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Header({ className, ...props }: HeaderProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots, { keyPrefix: 'header' });

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleHideModal = useCallback(() => setShowModal(false), []);
  const handleAddButtonClick = useCallback(() => setShowModal(true), []);

  return (
    <>
      <TelegramBotAdditionModal show={showModal} onHide={handleHideModal} />
      <div
        {...props}
        className={classNames(
          'flex flex-wrap items-center justify-between gap-1 lg:gap-2',
          className,
        )}
      >
        <h2 className='text-center text-4xl font-semibold max-lg:w-full'>
          {t('title')}
        </h2>
        <PlusButton
          variant='dark'
          className='max-lg:w-full'
          onClick={handleAddButtonClick}
        >
          {t('addTelegramBotButton')}
        </PlusButton>
      </div>
    </>
  );
}

export default Header;
