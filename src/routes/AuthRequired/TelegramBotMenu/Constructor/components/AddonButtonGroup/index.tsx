import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import AddonButton from './components/AddonButton';

import cn from 'utils/cn';

export interface AddonButtonGroupProps
  extends Omit<CollapsibleProps, 'open' | 'onOpenChange'> {}

function AddonButtonGroup({
  children,
  className,
  ...props
}: AddonButtonGroupProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'addonButtonGroup',
  });

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Collapsible
      {...props}
      open={open}
      className={cn('w-full', className)}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger asChild>
        <Button
          size='sm'
          variant={open ? 'secondary' : 'dark'}
          className='w-full data-[state=open]:rounded-b-none'
        >
          {open ? t('hideButton') : t('showButton')}
        </Button>
      </Collapsible.Trigger>
      <Collapsible.Body>
        <div
          className={cn(
            'flex',
            'flex-col',
            'bg-light',
            'border',
            'border-outline',
            'border-t-0',
            'rounded-sm',
            'rounded-t-none',
            'p-1',
            'gap-1',
          )}
        >
          {children}
        </div>
      </Collapsible.Body>
    </Collapsible>
  );
}

export default Object.assign(AddonButtonGroup, { Button: AddonButton });
