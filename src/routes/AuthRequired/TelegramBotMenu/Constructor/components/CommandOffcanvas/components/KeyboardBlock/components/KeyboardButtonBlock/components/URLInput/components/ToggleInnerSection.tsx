import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import cn from 'utils/cn';

import { useCommandOffcanvasStore } from '../../../../../../../store';

export interface ToggleInnerSectionProps
  extends Omit<CollapsibleProps, 'open' | 'onOpenChange'> {}

function ToggleInnerSection({
  className,
  children,
  ...props
}: ToggleInnerSectionProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock.urlInputCollapse',
  });

  const show = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.showURLInput,
  );
  const setShow = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.setShowURLInput,
  );

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

export default ToggleInnerSection;
