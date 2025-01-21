import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';
import { produce } from 'immer';

import { Files } from '..';

import FileDetail from './FileDetail';

export type FileListProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

const blockStyle: CSSProperties = { maxHeight: 171 };

function FileList({
  className,
  ...props
}: FileListProps): ReactElement<FileListProps> | null {
  const [{ value: files }, _meta, { setValue }] = useField<Files>('files');

  function handleDragEnd(result: DropResult): void {
    if (!result.destination) return;

    setValue(
      produce(files, (draft) => {
        const [movedFile] = draft.splice(result.source.index, 1);
        draft.splice(result.destination!.index, 0, movedFile);
      }),
    );
  }

  return files.length ? (
    <div
      {...props}
      className={classNames(
        'bg-light overflow-auto border rounded-1 gap-1 p-1',
        className,
      )}
      style={blockStyle}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId='command-offcanvas-files'>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='row g-1'
            >
              {files.map((file, index) => (
                <FileDetail key={file.key} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  ) : null;
}

export default memo(FileList);
