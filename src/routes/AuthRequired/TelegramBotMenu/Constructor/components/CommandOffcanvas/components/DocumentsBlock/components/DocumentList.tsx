import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';
import { produce } from 'immer';

import { Documents } from '..';

import DocumentDetail from './DocumentDetail';

export type DocumentsListProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

const blockStyle: CSSProperties = { maxHeight: 171 };

function DocumentsList({
  className,
  ...props
}: DocumentsListProps): ReactElement<DocumentsListProps> | null {
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
      className={classNames(
        'bg-light overflow-auto border rounded-1 gap-1 p-1',
        className,
      )}
      style={blockStyle}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='command-offcanvas-documents'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='row g-1'
            >
              {documents.map((document, index) => (
                <DocumentDetail key={document.key} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  ) : null;
}

export default memo(DocumentsList);
