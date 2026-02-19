import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import cn from 'utils/cn';

import { useKeyboardButtonPopoverStore } from '../../../store';

export interface ToggleSectionProps
  extends Omit<CollapsibleProps, 'open' | 'onOpenChange'> {}

function ToggleSection({
  className,
  children,
  ...props
}: ToggleSectionProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover.urlInputCollapse',
  });

  const show = useKeyboardButtonPopoverStore((state) => state.showURLInput);
  const setShow = useKeyboardButtonPopoverStore((state) => state.setShowURLInput);

  return (
    <Collapsible
      {...props}
      open={show}
      className={cn('w-full', className)}
      onOpenChange={setShow}
    >
      <Collapsible.Trigger asChild>
        <Button
          size='sm'
          variant={show ? 'secondary' : 'dark'}
          className='w-full data-[state=open]:rounded-b-none'
        >
          {show ? t('hideButton') : t('showButton')}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default ToggleSection;
