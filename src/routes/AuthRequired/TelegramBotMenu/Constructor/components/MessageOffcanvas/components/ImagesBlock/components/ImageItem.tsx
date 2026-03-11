import React, { type LiHTMLAttributes, memo, type ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  FastField,
  type FastFieldProps,
  FieldArray,
  type FieldArrayRenderProps,
  type FieldInputProps,
  type FormikProps,
} from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import Button from 'components/ui/Button';
import IconButton from 'components/ui/IconButton';

import MediaPopover from '../../../../MediaPopover';
import type { ResultData } from '../../../../MediaPopover/types';

import cn from 'utils/cn';

import type { FormValues } from '../../..';
import { useMessageOffcanvasStore } from '../../../store';
import type { Image } from '../types';

export interface ImageItemProps extends Omit<
  LiHTMLAttributes<HTMLLIElement>,
  'children'
> {
  index: number;
}

function ImageItem({ index, className, ...props }: ImageItemProps): ReactElement {
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  function handleEdit(
    form: FormikProps<FormValues>,
    field: FieldInputProps<Image>,
    data: ResultData,
  ): void {
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.from_url = data.url;
      }),
    );
  }

  function handleDeleteClick(image: Image, arrayField: FieldArrayRenderProps): void {
    const file: File | null = image.file;

    arrayField.remove(index);

    if (file) {
      setUsedStorageSize((prev) => prev - file.size);
    }
  }

  return (
    <FastField name={`images[${index}]`}>
      {({ field, form }: FastFieldProps) => {
        const image: Image = field.value;

        return (
          <MediaPopover
            media={{ file: image.file, url: image.from_url }}
            onEdit={(data) => handleEdit(form, field, data)}
          >
            <Draggable
              index={index}
              draggableId={`message-offcanvas-image-${image.key}`}
            >
              {({ innerRef, draggableProps, dragHandleProps }) => (
                <li
                  {...props}
                  {...draggableProps}
                  {...dragHandleProps}
                  ref={innerRef}
                  className={cn('flex', 'items-center', 'w-full', 'gap-1', className)}
                >
                  <MediaPopover.Trigger asChild>
                    <Button
                      asChild
                      size='sm'
                      variant='dark'
                      className='flex-auto justify-start wrap-anywhere'
                    >
                      <span>{image.file?.name ?? image.from_url ?? 'UNKNOWN'}</span>
                    </Button>
                  </MediaPopover.Trigger>
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
                </li>
              )}
            </Draggable>
          </MediaPopover>
        );
      }}
    </FastField>
  );
}

export default memo(ImageItem);
