import React, { HTMLAttributes, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';

import { Documents } from '..';

import DocumentItem from './DocumentItem';

import cn from 'utils/cn';

export interface DocumentsListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function DocumentsList({
  className,
  ...props
}: DocumentsListProps): ReactElement | null {
  const [{ value: documents }, _meta, { setValue: setDocuments }] =
    useField<Documents>('documents');

  function handleDragEnd(result: DropResult): void {
    if (!result.destination) return;

    setDocuments(
      produce(documents, (draft) => {
        const [movedDocument] = draft.splice(result.source.index, 1);
        draft.splice(result.destination!.index, 0, movedDocument);
      }),
    );
  }

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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='command-offcanvas-documents'>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
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
}

export default DocumentsList;
