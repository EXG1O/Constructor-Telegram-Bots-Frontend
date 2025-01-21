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

import { CustomFile, Files } from '..';

import Button from 'components/Button';

import TrashIcon from 'assets/icons/trash.svg';

export interface FileDetailProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  index: number;
}

const fileNameStyle: CSSProperties = { cursor: 'pointer' };

function FileDetail({
  index,
  ...props
}: FileDetailProps): ReactElement<FileDetailProps> {
  const [{ value: files }, _meta, { setValue }] = useField<Files>({ name: 'files' });

  const file = useMemo<CustomFile>(() => files[index], [index]);

  function handleDeleteButtonClick(): void {
    setValue(
      produce(files, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <Draggable index={index} draggableId={`command-offcanvas-file-${file.key}`}>
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

export default memo(FileDetail);
