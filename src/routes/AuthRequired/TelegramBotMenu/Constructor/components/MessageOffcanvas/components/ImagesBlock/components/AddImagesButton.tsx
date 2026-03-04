import React, { type ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useMessageOffcanvasStore } from '../../../store';
import type { Image, Images } from '..';

export interface AddImagesButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'htmlFor'
> {}

function AddImagesButton(props: AddImagesButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.imagesBlock.addImagesButton',
  });

  const getRemainingStorageSize = useMessageOffcanvasStore(
    (state) => state.getRemainingStorageSize,
  );
  const setImagesLoading = useMessageOffcanvasStore((state) => state.setImagesLoading);
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  const [{ value: images }, _meta, { setValue: setImages }] =
    useField<Images>('images');

  const id = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    setImagesLoading(true);

    const newImages: File[] = Object.values(event.target.files);
    event.target.value = '';

    let availableStorageSize: number = getRemainingStorageSize();
    let newImagesTotalSize: number = 0;

    setImages([
      ...images,
      ...newImages
        .filter((newImage) => {
          if (newImage.size > 2621440) {
            createMessageToast({
              message: t('messages.addImages.error', {
                context: 'tooLarge',
                name: newImage.name,
              }),
              level: 'error',
            });
            return false;
          }

          if (availableStorageSize - newImage.size < 0) {
            createMessageToast({
              message: t('messages.addImages.error', {
                context: 'notEnoughStorage',
                name: newImage.name,
              }),
              level: 'error',
            });
            return false;
          }

          availableStorageSize -= newImage.size;
          newImagesTotalSize += newImage.size;

          return true;
        })
        .map<Image>((file) => ({
          key: crypto.randomUUID(),
          file: file,
          file_url: URL.createObjectURL(file),
          from_url: null,
        })),
    ]);
    setUsedStorageSize((prev) => prev + newImagesTotalSize);
    setImagesLoading(false);
  }

  return (
    <>
      <input
        id={id}
        type='file'
        accept='image/*'
        multiple
        hidden
        onChange={handleChange}
      />
      <Button {...props} asChild size='sm' variant='dark'>
        <label htmlFor={id}>{t('text')}</label>
      </Button>
    </>
  );
}

export default AddImagesButton;
