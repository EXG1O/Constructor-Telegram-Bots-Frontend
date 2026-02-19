import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Popover, { PopoverProps } from 'components/ui/Popover';
import { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';

import TextInput, { Text } from './components/TextInput';
import URLInput, { URL as URLValue } from './components/URLInput';

import { KeyboardButton } from '../Keyboard/components/DraggableKeyboardButton';
import { KeyboardRow } from '../Keyboard/components/DraggableKeyboardRow';
import { Type } from '../KeyboardTypes';

import cn from 'utils/cn';

import { useKeyboardButtonPopoverStore } from './store';

export interface Data {
  text: Text;
  url: URLValue;
}

export interface KeyboardButtonPopoverProps
  extends Pick<PopoverProps, 'children'>,
    Omit<PopoverBodyProps, 'size' | 'children'> {
  rowIndex?: number;
  buttonIndex?: number;
  button?: KeyboardButton;
}

function KeyboardButtonPopover({
  rowIndex,
  buttonIndex,
  button,
  className,
  children,
  ...props
}: KeyboardButtonPopoverProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover',
  });

  const initialize = useKeyboardButtonPopoverStore((state) => state.initialize);
  const setErrors = useKeyboardButtonPopoverStore((state) => state.setErrors);

  const [{ value: keyboardType }] = useField<Type>('keyboard.type');
  const [{ value: rows }, _meta, { setValue: setRows }] =
    useField<KeyboardRow[]>('keyboard.rows');

  const action = rowIndex !== undefined && buttonIndex !== undefined ? 'edit' : 'add';

  function urlInputVisible(): boolean {
    return (
      useKeyboardButtonPopoverStore.getState().showURLInput &&
      keyboardType !== 'default'
    );
  }

  function validateData(data: Data): boolean {
    const errors: Record<string, string> = {};

    if (!data.text) {
      errors.text = t('messages.emptyTextError');
    }

    if (urlInputVisible()) {
      try {
        new URL(data.url);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.url = t('messages.invalidURLError');
        }
      }
    }

    if (Object.keys(errors).length) {
      setErrors(errors);
      return false;
    }

    return true;
  }

  function handleAddClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const { text, url } = useKeyboardButtonPopoverStore.getState();

    if (!validateData({ text, url })) {
      event.preventDefault();
      return;
    }

    setRows(
      produce(rows, (draft) => {
        draft.push({
          draggableId: crypto.randomUUID(),
          buttons: [
            {
              draggableId: crypto.randomUUID(),
              text,
              url: urlInputVisible() ? url : null,
            },
          ],
        });
      }),
    );
  }

  function handleSaveClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const { text, url } = useKeyboardButtonPopoverStore.getState();

    if (!validateData({ text, url })) {
      event.preventDefault();
      return;
    }

    setRows(
      produce(rows, (draft) => {
        const button = draft[rowIndex!].buttons[buttonIndex!];
        button.text = text;
        button.url = urlInputVisible() ? url : null;
      }),
    );
  }

  function handleDeleteClick(): void {
    setRows(
      produce(rows, (draft) => {
        draft[rowIndex!].buttons.splice(buttonIndex!, 1);
      }),
    );
  }

  function handleOpenChange(open: boolean): void {
    if (open) {
      initialize(button);
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      {children}
      <Popover.Body
        {...props}
        size='sm'
        className={cn('flex', 'flex-col', 'w-70', 'gap-1', className)}
      >
        <TextInput />
        {keyboardType !== 'default' && (
          <URLInput.ToggleSection>
            <URLInput />
          </URLInput.ToggleSection>
        )}
        <div className='flex w-full gap-1'>
          <Popover.Close asChild>
            <Button
              size='sm'
              variant='success'
              className='w-full'
              onClick={action === 'add' ? handleAddClick : handleSaveClick}
            >
              {t('actionButton', { context: action })}
            </Button>
          </Popover.Close>
          {action === 'edit' && (
            <Popover.Close asChild>
              <Button
                size='sm'
                variant='danger'
                className='w-full'
                onClick={handleDeleteClick}
              >
                {t('deleteButton')}
              </Button>
            </Popover.Close>
          )}
        </div>
      </Popover.Body>
    </Popover>
  );
}

export default Object.assign(KeyboardButtonPopover, { Trigger: Popover.Trigger });
