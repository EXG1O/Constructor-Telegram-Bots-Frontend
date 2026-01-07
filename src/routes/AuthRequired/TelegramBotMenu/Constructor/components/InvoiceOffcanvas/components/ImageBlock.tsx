import React, { ReactElement, useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import Button from 'components/ui/Button';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBotStorage from '../hooks/useTelegramBotStorage';

import cn from 'utils/cn';

export interface Image {
  file: File | null;
  file_url: string | null;
  from_url: string | null;
}

export interface ImageBlockFormValues {
  image: Image | null;
}

export interface ImageBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultImage: Image | null = null;
export const defaultImageBlockFormValues: ImageBlockFormValues = {
  image: defaultImage,
};

function ImageBlock({ className, ...props }: ImageBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas.imageBlock',
  });

  const [{ value: image }, _meta, { setValue: setImage }] =
    useField<ImageBlockFormValues['image']>('image');

  const [loading, setLoading] = useState<boolean>(false);

  const { remainingStorageSize } = useTelegramBotStorage();

  const inputID = useId();

  useEffect(() => {
    return () => {
      if (!image?.file_url) return;
      URL.revokeObjectURL(image.file_url);
    };
  }, [image?.file_url]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    setLoading(true);

    const newImage: File = event.target.files[0];
    event.target.value = '';

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

    if (remainingStorageSize - newImage.size < 0) {
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
      <input id={inputID} hidden type='file' accept='image/*' onChange={handleChange} />
      <Button asChild size='sm' variant='dark'>
        <label htmlFor={inputID}>{t('addButton')}</label>
      </Button>
    </Block>
  );
}

export default ImageBlock;
