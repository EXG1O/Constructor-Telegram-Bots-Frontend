import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import DocumentsBlock, {
  defaultDocuments,
  defaultDocumentsBlockFormValues,
  Document,
  DocumentsBlockFormValues,
} from './components/DocumentsBlock';
import ImagesBlock, {
  defaultImages,
  defaultImagesBlockFormValues,
  Image,
  ImagesBlockFormValues,
} from './components/ImagesBlock';
import KeyboardBlock, {
  defaultKeyboard,
  defaultKeyboardBlockFormValues,
  KeyboardBlockFormValues,
} from './components/KeyboardBlock';
import { KeyboardRow } from './components/KeyboardBlock/components/Keyboard';
import MessageBlock, {
  defaultMessageBlockFormValues,
  MessageBlockFormValues,
} from './components/MessageBlock';
import SettingsBlock, {
  defaultSettingsBlockFormValues,
  SettingsBlockFormValues,
} from './components/SettingsBlock';
import TelegramBotStorage from './components/TelegramBotStorage';

import AddonButtonGroup from '../AddonButtonGroup';
import FormToggleSection from '../FormToggleSection';
import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

import { CommandAPI, CommandsAPI } from 'api/telegram_bots/command';
import { Command, Data } from 'api/telegram_bots/command/types';

import { useCommandOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
    SettingsBlockFormValues,
    ImagesBlockFormValues,
    DocumentsBlockFormValues,
    MessageBlockFormValues,
    KeyboardBlockFormValues {
  show_images_block: boolean;
  show_documents_block: boolean;
  show_keyboard_block: boolean;
}

interface InnerCommandOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultSettingsBlockFormValues,
  ...defaultImagesBlockFormValues,
  ...defaultDocumentsBlockFormValues,
  ...defaultMessageBlockFormValues,
  ...defaultKeyboardBlockFormValues,

  show_images_block: false,
  show_documents_block: false,
  show_keyboard_block: false,
};

function InnerCommandOffcanvas({
  onHidden,
  ...props
}: InnerCommandOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const commandID = useCommandOffcanvasStore((state) => state.commandID);
  const type = useCommandOffcanvasStore((state) => state.type);
  const show = useCommandOffcanvasStore((state) => state.show);
  const loading = useCommandOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useCommandOffcanvasStore((state) => state.setLoading);

  const formID = useId();

  useEffect(() => {
    if (!commandID) return;
    (async () => {
      const response = await CommandAPI.get(telegramBot.id, commandID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('commandOffcanvas.messages.getCommand.error'),
          level: 'error',
        });
        return;
      }

      const { id, images, documents, keyboard, ...command } = response.json;

      setValues({
        ...command,

        images: images.length
          ? images
              .sort((a, b) => a.position - b.position)
              .map<Image>(({ id, name, size, url, from_url }) => ({
                id,
                key: crypto.randomUUID(),
                file: null,
                name: name ?? from_url!,
                size: size ?? 0,
                url: url ?? from_url!,
                from_url,
              }))
          : defaultImages,
        documents: documents.length
          ? documents
              .sort((a, b) => a.position - b.position)
              .map<Document>(({ id, name, size, url, from_url }) => ({
                id,
                key: crypto.randomUUID(),
                file: null,
                name: name ?? from_url!,
                size: size ?? 0,
                url: url ?? from_url!,
                from_url,
              }))
          : defaultDocuments,
        keyboard: keyboard
          ? {
              type: keyboard.type,
              rows: keyboard.buttons.reduce<KeyboardRow[]>(
                (rows, { id, row: rowIndex, position: buttonIndex, text, url }) => {
                  if (!rows[rowIndex]) {
                    rows[rowIndex] = {
                      draggableId: crypto.randomUUID(),
                      buttons: [],
                    };
                  }

                  rows[rowIndex].buttons[buttonIndex] = {
                    id,
                    draggableId: crypto.randomUUID(),
                    text,
                    url,
                  };

                  return rows;
                },
                [],
              ),
            }
          : defaultKeyboard,

        show_images_block: Boolean(images.length),
        show_documents_block: Boolean(documents.length),
        show_keyboard_block: Boolean(keyboard),
      });
      setLoading(false);
    })();
  }, [commandID]);

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={hideOffcanvas}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {t('commandOffcanvas.title', { context: type })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <SettingsBlock className='mb-3' />
          <FormToggleSection name='show_images_block'>
            <ImagesBlock className='mb-3' />
          </FormToggleSection>
          <FormToggleSection name='show_documents_block'>
            <DocumentsBlock className='mb-3' />
          </FormToggleSection>
          <MessageBlock className='mb-3' />
          <FormToggleSection name='show_keyboard_block'>
            <KeyboardBlock className='mb-3' />
          </FormToggleSection>
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <TelegramBotStorage />
        <AddonButtonGroup>
          <AddonButtonGroup.Button name='show_images_block'>
            {t('commandOffcanvas.imagesBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_documents_block'>
            {t('commandOffcanvas.documentsBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_keyboard_block'>
            {t('commandOffcanvas.keyboardBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_api_request_block'>
            {t('apiRequestBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_database_block'>
            {t('commandOffcanvas.databaseRecordBlock.title')}
          </AddonButtonGroup.Button>
        </AddonButtonGroup>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('commandOffcanvas.actionButton', { context: type })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface CommandOffcanvasProps extends InnerCommandOffcanvasProps {
  onAdd?: (command: Command) => void;
  onSave?: (command: Command) => void;
}

function CommandOffcanvas({ onAdd, onSave }: CommandOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const commandID = useCommandOffcanvasStore((state) => state.commandID);
  const type = useCommandOffcanvasStore((state) => state.type);
  const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    {
      images,
      documents,
      keyboard,
      show_images_block,
      show_documents_block,
      show_keyboard_block,
      ...values
    }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.CommandsAPI.Create | Data.CommandAPI.Update = {
      ...values,
      images:
        show_images_block && images.length
          ? images.map<Data.CommandsAPI.CreateCommandMedia>(
              ({ id, file, from_url }, index) => ({
                id,
                position: index,
                file,
                from_url,
              }),
            )
          : null,
      documents:
        show_documents_block && documents.length
          ? documents.map<Data.CommandsAPI.CreateCommandMedia>(
              ({ id, file, from_url }, index) => ({
                id,
                position: index,
                file,
                from_url,
              }),
            )
          : null,
      keyboard: show_keyboard_block
        ? {
            type: keyboard.type,
            buttons: keyboard.rows.reduce<
              Data.CommandsAPI.CreateCommandKeyboardButton[]
            >((buttons, row, rowIndex) => {
              buttons.push(
                ...row.buttons.map(({ id, text, url }, buttonIndex) => ({
                  id,
                  row: rowIndex,
                  position: buttonIndex,
                  text,
                  url,
                })),
              );

              return buttons;
            }, []),
          }
        : null,
    };

    const response = await (type === 'add'
      ? CommandsAPI.create(telegramBot.id, data)
      : CommandAPI.update(telegramBot.id, commandID!, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${type}Command.error`),
        level: 'error',
      });
      return;
    }

    (type === 'add' ? onAdd : onSave)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${type}Command.success`),
      level: 'success',
    });
  }

  return (
    <Formik
      initialValues={defaultFormValues}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      <InnerCommandOffcanvas />
    </Formik>
  );
}

export default CommandOffcanvas;
