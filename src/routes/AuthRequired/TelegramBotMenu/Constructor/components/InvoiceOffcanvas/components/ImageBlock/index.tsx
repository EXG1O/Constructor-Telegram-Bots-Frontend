import React, { type ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import MediaPopover from '../../../MediaPopover';
import type { ResultData } from '../../../MediaPopover/types';

import cn from 'utils/cn';

import { useInvoiceOffcanvasStore } from '../../store';
import type { ImageBlockFormValues } from './types';

export interface ImageBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function ImageBlock({ className, ...props }: ImageBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas.imageBlock',
  });

  const getRemainingStorageSize = useInvoiceOffcanvasStore(
    (state) => state.getRemainingStorageSize,
  );
  const setUsedStorageSize = useInvoiceOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  const [{ value: image }, _meta, { setValue: setImage }] =
    useField<ImageBlockFormValues['image']>('image');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (!image?.file_url) return;
      URL.revokeObjectURL(image.file_url);
    };
  }, [image?.file_url]);

  function handleAdd({ files, url }: ResultData): void {
    setLoading(true);

    if (files && files.length) {
      const newImage: File = files[0];

      if (newImage.size > 2621440) {
        createMessageToast({
          message: t('messages.addImage.error', {
            context: 'tooLarge',
            name: newImage.name,
          }),
          level: 'error',
        });
        setLoading(false);
        return;
      }

      if (getRemainingStorageSize() - newImage.size < 0) {
        createMessageToast({
          message: t('messages.addImage.error', {
            context: 'notEnoughStorage',
            name: newImage.name,
          }),
          level: 'error',
        });
        setLoading(false);
        return;
      }

      setImage({
        file: newImage,
        file_url: URL.createObjectURL(newImage),
        from_url: null,
      });
      setUsedStorageSize((prev) => prev - (image?.file?.size ?? 0) + newImage.size);
    } else if (url) {
      setImage({ file: null, file_url: null, from_url: url });
    }

    setLoading(false);
  }

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      {(loading || image) && (
        <Slot className='h-50 w-full overflow-hidden rounded-sm border border-outline bg-white'>
          {!loading ? (
            image && (
              <div>
                <img
                  src={image.file_url ?? image.from_url ?? undefined}
                  className='size-full object-contain'
                />
              </div>
            )
          ) : (
            <div className='flex items-center justify-center'>
              <Spinner size='sm' />
            </div>
          )}
        </Slot>
      )}
      <MediaPopover accept='image/*' onAdd={handleAdd}>
        <MediaPopover.Trigger asChild>
          <Button size='sm' variant='dark'>
            {t('addButton')}
          </Button>
        </MediaPopover.Trigger>
      </MediaPopover>
    </Block>
  );
}

export default ImageBlock;
