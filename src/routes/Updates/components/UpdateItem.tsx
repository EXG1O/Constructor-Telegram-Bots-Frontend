import React, { ReactElement } from 'react';

import Block, { BlockProps } from 'components/ui/Block';
import Markdown from 'components/ui/Markdown';

import { Update } from 'api/updates/types';

import cn from 'utils/cn';

export interface UpdateDisplayProps extends Omit<BlockProps, 'children'> {
  update: Update;
}

function UpdateItem({ update, className, ...props }: UpdateDisplayProps): ReactElement {
  return (
    <Block {...props} className={cn('text-foreground', className)}>
      <Markdown>{update.description}</Markdown>
    </Block>
  );
}

export default UpdateItem;
