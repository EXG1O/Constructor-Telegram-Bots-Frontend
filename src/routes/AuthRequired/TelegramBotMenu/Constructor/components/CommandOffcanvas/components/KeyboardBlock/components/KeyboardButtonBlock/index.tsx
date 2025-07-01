import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import Button from 'components/ui/Button';

import TextInput, { Text } from './components/TextInput';
import ToggleSection from './components/ToggleSection';
import URLInput, { URL as URLValue } from './components/URLInput';

import { KeyboardRow } from '../Keyboard/components/DraggableKeyboardRow';
import { Type } from '../KeyboardTypes';

import cn from 'utils/cn';

import { useCommandOffcanvasStore } from '../../../../store';

export interface KeyboardButton {
  text: Text;
  url: URLValue;
}

export interface KeyboardButtonBlockProps
  extends Omit<BlockProps, 'size' | 'variant' | 'children'> {}

function KeyboardButtonBlock({
  className,
  ...props
}: KeyboardButtonBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock',
  });

  const blockType = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.type);
  const shouldShowURLInput = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.showURLInput,
  );
  const hideBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.hideBlock,
  );

  const [{ value: keyboardType }] = useField<Type>('keyboard.type');
  const [{ value: rows }, _meta, { setValue: setRows }] =
    useField<KeyboardRow[]>(`keyboard.rows`);

  const showURLInput: boolean = shouldShowURLInput && keyboardType !== 'default';

  function validateData(): boolean {
    const errors: Record<string, string> = {};
    const {
      keyboardButtonBlock: { text, url, setErrors },
    } = useCommandOffcanvasStore.getState();

    if (!text) {
      errors.text = t('messages.emptyTextError');
      setErrors(errors);
      return false;
    }

    if (showURLInput) {
      try {
        new URL(url);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.url = t('messages.invalidURLError');
          setErrors(errors);
        }
        return false;
      }
    }

    return true;
  }

  function handleAddClick(): void {
    if (!validateData()) return;

    const {
      keyboardButtonBlock: { text, url },
    } = useCommandOffcanvasStore.getState();

    setRows(
      produce(rows, (draft) => {
        draft.push({
          draggableId: crypto.randomUUID(),
          buttons: [
            {
              draggableId: crypto.randomUUID(),
              text,
              url: showURLInput ? url : null,
            },
          ],
        });
      }),
    );
    hideBlock();
  }

  function handleSaveClick(): void {
    if (!validateData()) return;

    const {
      keyboardButtonBlock: { rowIndex, buttonIndex, text, url },
    } = useCommandOffcanvasStore.getState();

    if (rowIndex === null) {
      throw Error('You call the save action, but rowIndex state must not be null.');
    }

    if (buttonIndex === null) {
      throw Error('You call the save action, but buttonIndex state must not be null.');
    }

    setRows(
      produce(rows, (draft) => {
        const button = draft[rowIndex].buttons[buttonIndex];
        button.text = text;
        button.url = showURLInput ? url : null;
      }),
    );
    hideBlock();
  }

  function handleDeleteClick(): void {
    const {
      keyboardButtonBlock: { rowIndex, buttonIndex },
    } = useCommandOffcanvasStore.getState();

    hideBlock();
    setRows(
      produce(rows, (draft) => {
        draft[rowIndex!].buttons.splice(buttonIndex!, 1);
      }),
    );
  }

  return (
    <ToggleSection>
      <Block
        {...props}
        size='sm'
        variant='light'
        className={cn('bg-light-accent', className)}
      >
        <Block.Title>
          <h4 className='mb-1 text-base font-medium'>
            {t('title', { context: blockType })}
          </h4>
        </Block.Title>
        <TextInput wrapperProps={{ className: 'mb-1' }} />
        <URLInput.ToggleSection>
          <URLInput.ToggleInnerSection className='mb-1'>
            <URLInput />
          </URLInput.ToggleInnerSection>
        </URLInput.ToggleSection>
        <div className='flex w-full gap-1'>
          <Button
            size='sm'
            variant='success'
            className='w-full'
            onClick={blockType === 'add' ? handleAddClick : handleSaveClick}
          >
            {t('actionButton', { context: blockType })}
          </Button>
          {blockType === 'edit' && (
            <Button
              size='sm'
              variant='danger'
              className='w-full'
              onClick={handleDeleteClick}
            >
              {t('deleteButton')}
            </Button>
          )}
        </div>
      </Block>
    </ToggleSection>
  );
}

export default KeyboardButtonBlock;
