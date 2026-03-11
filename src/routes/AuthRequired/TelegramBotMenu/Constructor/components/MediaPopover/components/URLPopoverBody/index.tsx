import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Popover from 'components/ui/Popover';
import type { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';

import URLInput from './components/URLInput';

import cn from 'utils/cn';

import { useMediaPopoverStore } from '../../store';

export type URLValue = string;

export interface URLPopoverBodyProps extends Omit<
  PopoverBodyProps,
  'size' | 'children'
> {}

export const defaultURL: URLValue = '';

function URLPopoverBody({ className, ...props }: URLPopoverBodyProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'mediaPopover.urlPopoverBody',
  });

  const action = useMediaPopoverStore((state) => state.action);
  const onAdd = useMediaPopoverStore((state) => state.onAdd);
  const onEdit = useMediaPopoverStore((state) => state.onEdit);
  const setErrors = useMediaPopoverStore((state) => state.setErrors);

  function validateURL(url: URLValue): boolean {
    try {
      new URL(url);
    } catch (error) {
      if (error instanceof TypeError) {
        setErrors({ url: t('messages.invalidURLError') });
        return false;
      }
    }
    return true;
  }

  function handleActionClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const url = useMediaPopoverStore.getState().url!;

    if (!validateURL(url)) {
      event.preventDefault();
      return;
    }

    (action === 'add' ? onAdd : onEdit)?.({ url, files: null });
  }

  return (
    <Popover.Body
      {...props}
      size='sm'
      className={cn('flex', 'flex-col', 'gap-1', className)}
    >
      <URLInput />
      <Popover.Close asChild>
        <Button
          size='sm'
          variant='success'
          className='w-full'
          onClick={handleActionClick}
        >
          {t('saveButton')}
        </Button>
      </Popover.Close>
    </Popover.Body>
  );
}

export default URLPopoverBody;
