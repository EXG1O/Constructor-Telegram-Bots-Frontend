import React, { HTMLAttributes, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FieldInputProps, FormikProps } from 'formik';
import { produce } from 'immer';

import { Documents } from '..';

import DocumentItem from './DocumentItem';

import cn from 'utils/cn';

import { FormValues } from '../../..';

export interface DocumentsListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function DocumentsList({ className, ...props }: DocumentsListProps): ReactElement {
  function handleDragEnd(
    form: FormikProps<FormValues>,
    field: FieldInputProps<Documents>,
    result: DropResult,
  ): void {
    if (!result.destination) return;
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        const [movedDocument] = draft.splice(result.source.index, 1);
        draft.splice(result.destination!.index, 0, movedDocument);
      }),
    );
  }

  return (
    <FastField name='documents'>
      {({ field, form }: FastFieldProps) => {
        const documents: Documents = field.value;

        return documents.length ? (
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
            <div className='max-h-50 w-full overflow-y-auto p-1 scrollbar-thin'>
              <DragDropContext
                onDragEnd={(result) => handleDragEnd(form, field, result)}
              >
                <Droppable droppableId='message-offcanvas-documents'>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className='flex w-full flex-col gap-1'
                    >
                      {documents.map((document, index) => (
                        <DocumentItem key={document.key} index={index} />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        ) : null;
      }}
    </FastField>
  );
}

export default DocumentsList;
