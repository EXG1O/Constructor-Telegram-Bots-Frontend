import React, { ReactElement, useId, useState } from 'react';
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
  name: string;
  size: number;
  url: string;
  file: File | null;
  from_url: string | null;
}

interface ProcessedImage extends File {
  url?: string;
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
      return;
    }

    let processedImage: ProcessedImage | null = newImage;

    const fileRender = new FileReader();
    fileRender.readAsDataURL(newImage);
    fileRender.addEventListener('loadend', (event) => {
      if (!processedImage) return;

      if (event.target?.result) {
        processedImage.url = event.target.result.toString();
      } else {
        processedImage = null;
      }
    });

    const checkImageResult = () => {
      if (!processedImage) {
        createMessageToast({
          message: t('messages.addImage.error', { name: newImage.name }),
          level: 'error',
        });
        return;
      }

      if (!processedImage.url) {
        setTimeout(checkImageResult, 500);
        return;
      }

      setImage({
        name: processedImage.name,
        size: processedImage.size,
        url: processedImage.url,
        file: processedImage,
        from_url: null,
      });
      setLoading(false);
    };

    checkImageResult();
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
                <img src={image.url} className='size-full object-contain' />
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
