import React, { HTMLAttributes, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { Document, Documents } from '..';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface DocumentItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function DocumentItem({ index, className, ...props }: DocumentItemProps): ReactElement {
  const [{ value: documents }, _meta, { setValue: setDocuments }] = useField<Documents>(
    { name: 'documents' },
  );
  const file: Document = documents[index];

  function handleDeleteClick(): void {
    setDocuments(
      produce(documents, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <Draggable index={index} draggableId={`command-offcanvas-document-${file.key}`}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...props}
          {...draggableProps}
          {...dragHandleProps}
          className={cn('flex', 'items-center', 'w-full', 'gap-1', className)}
        >
          <span className='flex-auto rounded-sm bg-dark px-2 py-1 text-sm text-dark-foreground'>
            {file.name}
          </span>
          <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
            <Trash2 />
          </IconButton>
        </div>
      )}
    </Draggable>
  );
}

export default DocumentItem;
