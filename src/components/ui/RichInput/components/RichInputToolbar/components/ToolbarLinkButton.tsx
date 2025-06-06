import React, { ChangeEvent, forwardRef, useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Check, ExternalLink, Link, SquarePen, Trash2, X } from 'lucide-react';
import Quill from 'quill';

import IconButton from 'components/ui/IconButton';
import Input from 'components/ui/Input';
import Popover from 'components/ui/Popover';

import ToolbarButton, { ToolbarButtonProps } from './ToolbarButton';

import useRichInputStore from 'components/ui/RichInput/hooks/useRichInputStore';

export interface ToolbarLinkButtonProps extends Omit<ToolbarButtonProps, 'format'> {}

const ToolbarLinkButton = forwardRef<HTMLButtonElement, ToolbarLinkButtonProps>(
  ({ children, onClick, ...props }, ref) => {
    const quillInstance = useRichInputStore((state) => state.quill);

    const [show, setShow] = useState<boolean>(false);
    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [value, setValue] = useState<string>('');

    function getQuill(): Quill {
      if (!quillInstance) {
        throw Error('Quill editor is not initialized.');
      }

      return quillInstance;
    }

    function handleTriggerClick(): void {
      if (!show) {
        const quill = getQuill();
        const range = quill.selection.lastRange;

        if (!range) {
          throw new Error('Quill selection range is null.');
        }

        const linkValue = (quill.getFormat(range).link || null) as string | null;

        if (linkValue) {
          setMode('view');
          setValue(linkValue);
        } else {
          setMode('edit');
          setValue('');
        }
      }

      setShow(!show);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
      setValue(event.target.value);
    }

    function handleConfirmClick(): void {
      const quill = getQuill();

      setShow(false);
      quill.format('link', value, Quill.sources.USER);
    }

    function handleCancelClick(): void {
      setShow(false);
    }

    function handleEditClick(): void {
      setMode('edit');
    }

    function handleDeleteClick(): void {
      const quill = getQuill();

      setShow(false);
      quill.format('link', false, Quill.sources.USER);
    }

    return (
      <Popover open={show} onOpenChange={setShow}>
        <Popover.Trigger asChild>
          <ToolbarButton
            {...props}
            ref={ref}
            format='link'
            onClick={handleTriggerClick}
          >
            <Link />
            {children}
          </ToolbarButton>
        </Popover.Trigger>
        <Popover.Body size='sm' className='w-[260px]'>
          <Slot className='flex gap-1.5'>
            {mode == 'edit' ? (
              <div>
                <Input size='sm' autoFocus value={value} onChange={handleInputChange} />
                <div className='flex gap-0.5'>
                  <IconButton className='text-success' onClick={handleConfirmClick}>
                    <Check />
                  </IconButton>
                  <IconButton className='text-danger' onClick={handleCancelClick}>
                    <X />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className='justify-between'>
                <a
                  href={value}
                  rel='noreferrer'
                  target='_blank'
                  className='flex w-auto min-w-0 items-center gap-1 text-primary'
                >
                  <span className='truncate'>{value}</span>
                  <ExternalLink className='size-3.5 shrink-0' />
                </a>
                <div className='flex gap-1'>
                  <IconButton size='sm' onClick={handleEditClick}>
                    <SquarePen />
                  </IconButton>
                  <IconButton
                    size='sm'
                    className='text-danger'
                    onClick={handleDeleteClick}
                  >
                    <Trash2 />
                  </IconButton>
                </div>
              </div>
            )}
          </Slot>
        </Popover.Body>
      </Popover>
    );
  },
);
ToolbarLinkButton.displayName = 'ToolbarLinkButton';

export default ToolbarLinkButton;
