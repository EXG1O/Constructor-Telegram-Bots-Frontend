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
import type { Document } from '../types';

export interface DocumentItemProps extends Omit<
  LiHTMLAttributes<HTMLLIElement>,
  'children'
> {
  index: number;
}

function DocumentItem({ index, className, ...props }: DocumentItemProps): ReactElement {
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  function handleEdit(
    form: FormikProps<FormValues>,
    field: FieldInputProps<Document>,
    data: ResultData,
  ): void {
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.from_url = data.url;
      }),
    );
  }

  function handleDeleteClick(
    document: Document,
    arrayField: FieldArrayRenderProps,
  ): void {
    const file: File | null = document.file;

    arrayField.remove(index);

    if (file) {
      setUsedStorageSize((prev) => prev - file.size);
    }
  }

  return (
    <FastField name={`documents[${index}]`}>
      {({ field, form }: FastFieldProps) => {
        const document: Document = field.value;

        return (
          <MediaPopover
            media={{ file: document.file, url: document.from_url }}
            onEdit={(data) => handleEdit(form, field, data)}
          >
            <Draggable
              index={index}
              draggableId={`message-offcanvas-document-${document.key}`}
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
                      <span>
                        {document.file?.name ?? document.from_url ?? 'UNKNOWN'}
                      </span>
                    </Button>
                  </MediaPopover.Trigger>
                  <FieldArray name='documents'>
                    {(arrayField) => (
                      <IconButton
                        size='sm'
                        className='text-danger'
                        onClick={() => handleDeleteClick(document, arrayField)}
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

export default memo(DocumentItem);
