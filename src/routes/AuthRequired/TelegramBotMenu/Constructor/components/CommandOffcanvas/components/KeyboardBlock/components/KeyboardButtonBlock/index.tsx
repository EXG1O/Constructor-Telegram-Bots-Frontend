import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Button from 'components/Button';

import BlockCollapse from './components/BlockCollapse';
import TextInput, { Text } from './components/TextInput';
import URLInput, { URL as URLValue } from './components/URLInput';
import URLInputCollapse from './components/URLInputCollapse';

import Block, { BlockProps } from '../../../../../Block';
import { KeyboardRow } from '../Keyboard/components/DraggableKeyboardRow';

import { useCommandOffcanvasStore } from '../../../../store';

export interface KeyboardButton {
  text: Text;
  url: URLValue;
}

export type KeyboardButtonBlockProps = Pick<BlockProps, 'className'>;

function KeyboardButtonBlock(
  props: KeyboardButtonBlockProps,
): ReactElement<KeyboardButtonBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock',
  });

  const type = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.type);
  const hideBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.hideBlock,
  );

  const [{ value: rows }, _meta, { setValue }] =
    useField<KeyboardRow[]>(`keyboard.rows`);

  function validateButton(): boolean {
    const errors: Record<string, string> = {};
    const {
      keyboardButtonBlock: { showURLInput, text, url, setErrors },
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

  function handleAddButton(): void {
    if (!validateButton()) return;

    const {
      keyboardButtonBlock: { showURLInput, text, url },
    } = useCommandOffcanvasStore.getState();

    setValue(
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

  function handleSaveButton(): void {
    if (!validateButton()) return;

    const {
      keyboardButtonBlock: { rowIndex, buttonIndex, showURLInput, text, url },
    } = useCommandOffcanvasStore.getState();

    if (rowIndex === null) {
      throw Error('You call the save action, but rowIndex state must not be null.');
    }

    if (buttonIndex === null) {
      throw Error('You call the save action, but buttonIndex state must not be null.');
    }

    setValue(
      produce(rows, (draft) => {
        const button = draft[rowIndex].buttons[buttonIndex];
        button.text = text;
        button.url = showURLInput ? url : null;
      }),
    );
    hideBlock();
  }

  function handleDeleteButton(): void {
    const {
      keyboardButtonBlock: { rowIndex, buttonIndex },
    } = useCommandOffcanvasStore.getState();

    hideBlock();
    setValue(
      produce(rows, (draft) => {
        draft[rowIndex!].buttons.splice(buttonIndex!, 1);
      }),
    );
  }

  return (
    <BlockCollapse>
      <Block {...props} title={t('title', { context: type })}>
        <Block.Body>
          <TextInput />
          <URLInputCollapse>
            <URLInput />
          </URLInputCollapse>
        </Block.Body>
        <Block.Footer>
          <Row className='g-2'>
            <Col xs={type === 'add' ? 12 : 6}>
              <Button
                size='sm'
                variant='success'
                className='w-100'
                onClick={type === 'add' ? handleAddButton : handleSaveButton}
              >
                {t('actionButton', { context: type })}
              </Button>
            </Col>
            {type === 'edit' && (
              <Col xs={6}>
                <Button
                  size='sm'
                  variant='danger'
                  className='w-100'
                  onClick={handleDeleteButton}
                >
                  {t('deleteButton')}
                </Button>
              </Col>
            )}
          </Row>
        </Block.Footer>
      </Block>
    </BlockCollapse>
  );
}

export default memo(KeyboardButtonBlock);
