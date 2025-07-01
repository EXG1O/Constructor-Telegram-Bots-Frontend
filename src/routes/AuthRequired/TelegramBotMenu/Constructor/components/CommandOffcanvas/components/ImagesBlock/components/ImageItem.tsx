import React, { HTMLAttributes, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { Image, Images } from '..';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface ImageItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function ImageItem({ index, className, ...props }: ImageItemProps): ReactElement {
  const [{ value: images }, _meta, { setValue: setImages }] =
    useField<Images>('images');
  const image: Image = images[index];

  function handleDeleteClick(): void {
    setImages(
      produce(images, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <Draggable index={index} draggableId={`command-offcanvas-image-${image.key}`}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...props}
          {...draggableProps}
          {...dragHandleProps}
          className={cn('flex', 'items-center', 'w-full', 'gap-1', className)}
        >
          <span className='flex-auto rounded-sm bg-dark px-2 py-1 text-sm text-dark-foreground'>
            {image.name}
          </span>
          <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
            <Trash2 />
          </IconButton>
        </div>
      )}
    </Draggable>
  );
}

export default ImageItem;
