import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Block, { BlockProps } from 'components/ui/Block';
import Markdown from 'components/ui/Markdown';

import { Update } from 'api/updates/types';

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
    <Block {...props} className={classNames('dynamic-content', className)}>
      <Markdown>{update.description}</Markdown>
    </Block>
  );
}

export default UpdateDisplay;
