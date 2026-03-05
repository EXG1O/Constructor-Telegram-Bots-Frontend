import React, { type LiHTMLAttributes, memo, type ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {
  FastField,
  type FastFieldProps,
  FieldArray,
  type FieldArrayRenderProps,
} from 'formik';
import { Trash2 } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

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
      {({ field }: FastFieldProps) => {
        const document: Document = field.value;

        return (
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
                <span className='flex-auto rounded-sm bg-dark px-2 py-1 text-sm text-dark-foreground'>
                  {document.file?.name ?? document.from_url ?? 'UNKNOWN'}
                </span>
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
        );
      }}
    </FastField>
  );
}

export default memo(DocumentItem);
