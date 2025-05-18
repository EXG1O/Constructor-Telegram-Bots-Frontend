import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';
import { useField } from 'formik';

import Stack, { StackProps } from 'components/ui/Stack';

import AddHeaderButton from './components/AddHeaderButton';
import BlockCollapse from './components/BlockCollapse';
import HeaderInputGroup from './components/HeaderInputGroup';

export interface Header {
  key: string;
  value: string;
}

export type Headers = Header[];

export type HeadersBlockProps = Pick<StackProps, 'className'>;

export const defaultHeaders: Headers = [];

function HeadersBlock({
  className,
}: HeadersBlockProps): ReactElement<HeadersBlockProps> {
  const [{ value: headers }] = useField<Header[]>('api_request.headers');

  return (
    <BlockCollapse>
      <Stack
        className={classNames(
          'gap-1 border border-top-0 rounded-1 rounded-top-0 p-1',
          className,
        )}
      >
        {headers.map((_header, index) => (
          <HeaderInputGroup key={index} index={index} />
        ))}
        <AddHeaderButton />
      </Stack>
    </BlockCollapse>
  );
}

export default memo(HeadersBlock);
