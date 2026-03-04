import React, { forwardRef, lazy, Suspense, useMemo, useState } from 'react';

import Popover, { type PopoverProps } from 'components/ui/Popover';
import type { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';

import Loading from './components/Loading';
import TriggerIcon from './components/TriggerIcon';
import TypeSelect, { type Type } from './components/TypeSelect';
import TelegramBotVariablesPopoverContext, {
  type TelegramBotVariablesPopoverContextProps,
} from './contexts/TelegramBotVariablesPopoverContext';

import cn from 'utils/cn';

const SystemVariables = lazy(() => import('./components/SystemVariables'));
const UserVariables = lazy(() => import('./components/UserVariables'));
const DatabaseRecords = lazy(() => import('./components/DatabaseRecords'));

export interface TelegramBotVariablesPopoverProps
  extends
    Pick<PopoverProps, 'defaultOpen' | 'open' | 'onOpenChange'>,
    Omit<PopoverBodyProps, 'size' | 'onSelect'>,
    TelegramBotVariablesPopoverContextProps {}

const TelegramBotVariablesPopover = forwardRef<
  HTMLDivElement,
  TelegramBotVariablesPopoverProps
>(
  (
    { defaultOpen, open, className, children, onOpenChange, onSelect, ...props },
    ref,
  ) => {
    const [type, setType] = useState<Type>('system');

    const contextValue = useMemo<TelegramBotVariablesPopoverContextProps>(
      () => ({ onSelect }),
      [onSelect],
    );

    return (
      <Popover defaultOpen={defaultOpen} open={open} onOpenChange={onOpenChange}>
        {children}
        <Popover.Body {...props} ref={ref} size='sm' className={cn('w-70', className)}>
          <TelegramBotVariablesPopoverContext.Provider value={contextValue}>
            <TypeSelect type={type} className='mb-1.5' onChange={setType} />
            <Suspense fallback={<Loading />}>
              {type === 'system' ? (
                <SystemVariables />
              ) : type === 'user' ? (
                <UserVariables />
              ) : type == 'database' ? (
                <DatabaseRecords />
              ) : null}
            </Suspense>
          </TelegramBotVariablesPopoverContext.Provider>
        </Popover.Body>
      </Popover>
    );
  },
);
TelegramBotVariablesPopover.displayName = 'TelegramBotVariablesPopover';

export default Object.assign(TelegramBotVariablesPopover, {
  Trigger: Object.assign(Popover.Trigger, { Icon: TriggerIcon }),
});
