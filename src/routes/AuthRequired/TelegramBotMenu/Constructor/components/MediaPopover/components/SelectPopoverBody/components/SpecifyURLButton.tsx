import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';

import { useMediaPopoverStore } from '../../../store';

export interface SpecifyURLButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'children'
> {}

function SpecifyURLButton({ onClick, ...props }: SpecifyURLButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'mediaPopover.selectPopoverBody.specifyURLButton',
  });

  const toggleMode = useMediaPopoverStore((state) => state.toggleMode);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    toggleMode('url');
    onClick?.(event);
  }

  return (
    <Button {...props} size='sm' variant='dark' onClick={handleClick}>
      {t('text')}
    </Button>
  );
}

export default SpecifyURLButton;
