import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FieldArray, FieldArrayRenderProps } from 'formik';
import { Trash2 } from 'lucide-react';

import { Image } from '..';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

import { useMessageOffcanvasStore } from '../../../store';

export interface ImageItemProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  index: number;
}

function ImageItem({ index, className, ...props }: ImageItemProps): ReactElement {
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  function handleDeleteClick(image: Image, arrayField: FieldArrayRenderProps): void {
    const file: File | null = image.file;

    arrayField.remove(index);

    if (file) {
      setUsedStorageSize((prev) => prev - file.size);
    }
  }

  return (
    <FastField name={`images[${index}]`}>
      {({ field }: FastFieldProps) => {
        const image: Image = field.value;

        return (
          <Draggable index={index} draggableId={`message-offcanvas-image-${image.key}`}>
            {({ innerRef, draggableProps, dragHandleProps }) => (
              <div
                {...props}
                {...draggableProps}
                {...dragHandleProps}
                ref={innerRef}
                className={cn('flex', 'items-center', 'w-full', 'gap-1', className)}
              >
                <span className='flex-auto rounded-sm bg-dark px-2 py-1 text-sm text-dark-foreground'>
                  {image.file?.name ?? image.from_url ?? 'UNKNOWN'}
                </span>
                <FieldArray name='images'>
                  {(arrayField) => (
                    <IconButton
                      size='sm'
                      className='text-danger'
                      onClick={() => handleDeleteClick(image, arrayField)}
                    >
                      <Trash2 />
                    </IconButton>
                  )}
                </FieldArray>
              </div>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(ImageItem);
