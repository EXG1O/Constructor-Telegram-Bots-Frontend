import React, { forwardRef, lazy, Suspense, useMemo, useState } from 'react';

import Collapsible from 'components/ui/Collapsible';
import Popover, { PopoverProps } from 'components/ui/Popover';
import { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';

import Loading from './components/Loading';
import TriggerIcon from './components/TriggerIcon';
import TypeSelect, { Type } from './components/TypeSelect';
import TelegramBotVariablesPopoverContext, {
  TelegramBotVariablesPopoverContextProps,
} from './contexts/TelegramBotVariablesPopoverContext';

import cn from 'utils/cn';

const SystemVariables = lazy(() => import('./components/SystemVariables'));
const UserVariables = lazy(() => import('./components/UserVariables'));
const DatabaseRecords = lazy(() => import('./components/DatabaseRecords'));

export interface TelegramBotVariablesPopoverProps
  extends Pick<PopoverProps, 'defaultOpen' | 'open' | 'onOpenChange'>,
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
        <Popover.Body
          {...props}
          ref={ref}
          size='sm'
          className={cn('w-[280px]', className)}
        >
          <TelegramBotVariablesPopoverContext.Provider value={contextValue}>
            <TypeSelect type={type} className='mb-1.5' onChange={setType} />
            <Suspense fallback={<Loading />}>
              <Collapsible open={type === 'system'} className='w-full'>
                <Collapsible.Body>
                  <SystemVariables />
                </Collapsible.Body>
              </Collapsible>
              <Collapsible open={type === 'user'} className='w-full'>
                <Collapsible.Body>
                  <UserVariables />
                </Collapsible.Body>
              </Collapsible>
              <Collapsible open={type === 'database'} className='w-full'>
                <Collapsible.Body>
                  <DatabaseRecords />
                </Collapsible.Body>
              </Collapsible>
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
