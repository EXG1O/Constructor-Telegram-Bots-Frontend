import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import cn from 'utils/cn';

export interface ToggleSectionProps
  extends Omit<CollapsibleProps, 'open' | 'onOpenChange'> {}

function ToggleSection({
  className,
  children,
  ...props
}: ToggleSectionProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock.headersBlock',
  });

  const [{ value: open }, _meta, { setValue: setOpen }] = useField(
    'show_api_request_headers_block',
  );

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
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default ToggleSection;
