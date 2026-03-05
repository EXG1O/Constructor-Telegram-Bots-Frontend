import React, { type HTMLAttributes, type ReactElement } from 'react';
import { DragDropContext, Droppable, type DropResult } from 'react-beautiful-dnd';
import { Slot } from '@radix-ui/react-slot';
import type { FormikProps } from 'formik';
import { produce } from 'immer';

import Spinner from 'components/ui/Spinner';

import ImageItem from './ImageItem';

import cn from 'utils/cn';

import type { FormValues } from '../../..';
import { useMessageOffcanvasStore } from '../../../store';
import type { Images } from '../types';

export interface ImageListInnerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  form: FormikProps<FormValues>;
  images: Images;
}

function ImageListInner({
  form,
  images,
  className,
  ...props
}: ImageListInnerProps): ReactElement | null {
  const loading = useMessageOffcanvasStore((state) => state.imagesLoading);

  function handleDragEnd(result: DropResult): void {
    if (!result.destination) return;
    form.setFieldValue(
      'images',
      produce(images, (draft) => {
        const [movedImage] = draft.splice(result.source.index, 1);
        draft.splice(result.destination!.index, 0, movedImage);
      }),
    );
  }

  return loading || images.length ? (
    <div
      {...props}
      className={cn(
        'w-full',
        'bg-light-accent',
        'rounded-sm',
        'overflow-hidden',
        className,
      )}
    >
      <Slot className='max-h-50 w-full'>
        {!loading ? (
          <div className='overflow-y-auto p-1 scrollbar-thin'>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId='message-offcanvas-images'>
                {(provided) => (
                  <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='-mb-1 w-full'
                  >
                    {images.map((image, index) => (
                      <ImageItem key={image.key} index={index} className='mb-1' />
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        ) : (
          <div className='flex items-center justify-center p-2'>
            <Spinner size='sm' />
          </div>
        )}
      </Slot>
    </div>
  ) : null;
}

export default ImageListInner;
