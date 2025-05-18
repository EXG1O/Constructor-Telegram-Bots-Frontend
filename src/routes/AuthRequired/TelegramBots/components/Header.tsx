import React, {
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import PlusButton from 'components/ui/PlusButton';

import TelegramBotAdditionModal from './TelegramBotAdditionModal';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
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
          'd-flex flex-wrap justify-content-between gap-2',
          className,
        )}
      >
        <h1 className='flex-grow-1 flex-lg-grow-0 fw-semibold text-center mb-0'>
          {t('title')}
        </h1>
        <PlusButton
          variant='dark'
          className='flex-grow-1 flex-lg-grow-0 align-self-center'
          onClick={handleAddButtonClick}
        >
          {t('addTelegramBotButton')}
        </PlusButton>
      </div>
    </>
  );
}

export default memo(Header);
