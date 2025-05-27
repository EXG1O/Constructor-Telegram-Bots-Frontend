import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

import AddHeaderButton from './components/AddHeaderButton';
import BlockCollapse from './components/BlockCollapse';
import HeaderInputGroup from './components/HeaderInputGroup';

export interface Header {
  key: string;
  value: string;
}

export type Headers = Header[];

export type HeadersBlockProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

export const defaultHeaders: Headers = [];

function HeadersBlock({
  className,
}: HeadersBlockProps): ReactElement<HeadersBlockProps> {
  const [{ value: headers }] = useField<Header[]>('api_request.headers');

  return (
    <BlockCollapse>
      <div
        className={classNames(
          'flex flex-col gap-1 border border-top-0 rounded-1 rounded-top-0 p-1',
          className,
        )}
      >
        {headers.map((_header, index) => (
          <HeaderInputGroup key={index} index={index} />
        ))}
        <AddHeaderButton />
      </div>
    </BlockCollapse>
  );
}

export default memo(HeadersBlock);
