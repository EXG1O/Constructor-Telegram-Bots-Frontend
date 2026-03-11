import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import MediaPopover from '../../../../MediaPopover';
import type { ResultData } from '../../../../MediaPopover/types';

import { useMessageOffcanvasStore } from '../../../store';
import type { Image, Images } from '../types';

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

  function handleAdd({ files, url }: ResultData): void {
    setImagesLoading(true);

    if (files && files.length) {
      const newImages: File[] = files;

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
    } else if (url) {
      setImages([
        ...images,
        { key: crypto.randomUUID(), file: null, file_url: null, from_url: url },
      ]);
    }

    setImagesLoading(false);
  }

  return (
    <MediaPopover accept='image/*' multiple onAdd={handleAdd}>
      <MediaPopover.Trigger asChild>
        <Button {...props} size='sm' variant='dark'>
          {t('text')}
        </Button>
      </MediaPopover.Trigger>
    </MediaPopover>
  );
}

export default AddImagesButton;
