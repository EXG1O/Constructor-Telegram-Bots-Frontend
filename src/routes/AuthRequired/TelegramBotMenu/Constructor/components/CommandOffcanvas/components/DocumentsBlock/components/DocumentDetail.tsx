import React, {
  CSSProperties,
  HTMLAttributes,
  memo,
  ReactElement,
  useMemo,
} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';

import { Document, Documents } from '..';

import Button from 'components/ui/Button';

import TrashIcon from 'assets/icons/trash.svg';

export interface DocumentDetailProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  index: number;
}

const fileNameStyle: CSSProperties = { cursor: 'pointer' };

function DocumentDetail({
  index,
  ...props
}: DocumentDetailProps): ReactElement<DocumentDetailProps> {
  const [{ value: documents }, _meta, { setValue: setDocuments }] = useField<Documents>(
    { name: 'documents' },
  );

  const file = useMemo<Document>(() => documents[index], [index]);

  function handleDeleteButtonClick(): void {
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
          className='d-flex'
        >
          <small
            className='flex-fill text-bg-dark rounded-start-1 text-break px-2 py-1'
            style={fileNameStyle}
          >
            {file.name}
          </small>
          <Button
            size='sm'
            variant='danger'
            className='d-flex border-start-0 rounded-start-0 p-1'
            onClick={handleDeleteButtonClick}
          >
            <TrashIcon width={18} height={18} />
          </Button>
        </div>
      )}
    </Draggable>
  );
}

export default memo(DocumentDetail);
