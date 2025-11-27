import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';
import ModalClose from 'components/ui/Modal/components/ModalClose';

import cn from 'utils/cn';

export interface BlockButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  blockName: string;
}

function BlockButton({
  blockName,
  className,
  ...props
}: BlockButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: `selectBlockModal.blocks.${blockName}`,
  });

  return (
    <ModalClose asChild>
      <Button
        {...props}
        size='sm'
        variant='light'
        className={cn('flex', 'flex-col', 'p-1', 'gap-0', 'justify-start', className)}
      >
        <h3 className='text-base font-medium'>{t('name')}</h3>
        <p className='text-xs'>{t('description')}</p>
      </Button>
    </ModalClose>
  );
}

export default BlockButton;
