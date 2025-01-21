import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Block, { BlockProps } from 'components/Block';

import { Update } from 'api/updates/types';

import('styles/dynamic-content.scss');

export interface UpdateDisplayProps
  extends Omit<BlockProps, 'dangerouslySetInnerHTML' | 'children'> {
  update: Update;
}

function UpdateDisplay({
  update,
  className,
  ...props
}: UpdateDisplayProps): ReactElement<UpdateDisplayProps> {
  return (
    <Block
      {...props}
      className={classNames('dynamic-content', className)}
      dangerouslySetInnerHTML={{ __html: update.description }}
    />
  );
}

export default UpdateDisplay;
