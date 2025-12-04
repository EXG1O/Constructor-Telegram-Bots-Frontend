import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FormikProps } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { Document, Documents } from '..';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

import { FormValues } from '../../..';

export interface DocumentItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function DocumentItem({ index, className, ...props }: DocumentItemProps): ReactElement {
  function handleDeleteClick(form: FormikProps<FormValues>): void {
    const field = form.getFieldProps<Documents>('documents');
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <FastField name={`documents[${index}]`}>
      {({ field, form }: FastFieldProps) => {
        const document: Document = field.value;

        return (
          <Draggable
            index={index}
            draggableId={`message-offcanvas-document-${document.key}`}
          >
            {({ innerRef, draggableProps, dragHandleProps }) => (
              <div
                {...props}
                {...draggableProps}
                {...dragHandleProps}
                ref={innerRef}
                className={cn('flex', 'items-center', 'w-full', 'gap-1', className)}
              >
                <span className='flex-auto rounded-sm bg-dark px-2 py-1 text-sm text-dark-foreground'>
                  {document.name}
                </span>
                <IconButton
                  size='sm'
                  className='text-danger'
                  onClick={() => handleDeleteClick(form)}
                >
                  <Trash2 />
                </IconButton>
              </div>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(DocumentItem);
