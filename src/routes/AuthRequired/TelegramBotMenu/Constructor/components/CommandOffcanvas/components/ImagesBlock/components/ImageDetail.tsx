import React, {
  CSSProperties,
  HTMLAttributes,
  memo,
  ReactElement,
  useMemo,
} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';
import { produce } from 'immer';

import { Image, Images } from '..';

import Button from 'components/ui/Button';

import TrashIcon from 'assets/icons/trash.svg';

export interface ImageDetailProps
  extends Pick<HTMLAttributes<HTMLDivElement>, 'className'> {
  index: number;
}

const imageNameStyle: CSSProperties = { cursor: 'pointer' };

function ImageDetail({
  index,
  className,
  ...props
}: ImageDetailProps): ReactElement<ImageDetailProps> {
  const [{ value: images }, _meta, { setValue }] = useField<Images>('images');

  const image = useMemo<Image>(() => images[index], [index]);

  function handleDeleteButtonClick(): void {
    setValue(
      produce(images, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <Draggable index={index} draggableId={`command-offcanvas-image-${image.key}`}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...props}
          {...draggableProps}
          {...dragHandleProps}
          className={classNames(className, 'd-flex')}
        >
          <small
            className='flex-fill text-bg-dark rounded-start-1 text-break px-2 py-1'
            style={imageNameStyle}
          >
            {image.name}
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

export default memo(ImageDetail);
