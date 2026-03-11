import React, { type ReactElement, useEffect, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';

import Popover, { type PopoverProps } from 'components/ui/Popover';

import FilePopoverBody from './components/FilePopoverBody';
import SelectPopoverBody, {
  type SelectPopoverBodyProps,
} from './components/SelectPopoverBody';
import URLPopoverBody from './components/URLPopoverBody';
import SetOpenContext from './contexts/SetOpenContext';

import { type InitializeParams, useMediaPopoverStore } from './store';

export interface MediaPopoverProps
  extends
    PopoverProps,
    Pick<SelectPopoverBodyProps, 'accept' | 'multiple'>,
    Partial<InitializeParams> {}

function MediaPopover({
  media,
  accept,
  multiple,
  children,
  onAdd,
  onEdit,
  onOpenChange,
  ...props
}: MediaPopoverProps): ReactElement {
  const mode = useMediaPopoverStore((state) => state.mode);
  const initialize = useMediaPopoverStore((state) => state.initialize);

  // This is necessary because otherwise it is impossible to implement the correct ...
  // behavior of the `SelectPopoverBody/SelectFileButton` component.
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    useMediaPopoverStore.setState({ onAdd, onEdit });
  }, [onAdd, onEdit]);

  function handleOpenChange(open: boolean): void {
    if (open) {
      if (media || onAdd || onEdit) {
        initialize({ media, onAdd, onEdit });
      } else {
        initialize();
      }
    }
    setOpen(open);
    onOpenChange?.(open);
  }

  return (
    <SetOpenContext.Provider value={setOpen}>
      <Popover {...props} open={open} onOpenChange={handleOpenChange}>
        {children}
        <Slot className='min-w-70'>
          {mode === 'file' ? (
            <FilePopoverBody />
          ) : mode === 'url' ? (
            <URLPopoverBody />
          ) : (
            <SelectPopoverBody accept={accept} multiple={multiple} />
          )}
        </Slot>
      </Popover>
    </SetOpenContext.Provider>
  );
}

export default Object.assign(MediaPopover, { Trigger: Popover.Trigger });
