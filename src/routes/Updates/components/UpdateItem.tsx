import React, { ReactElement } from 'react';

import Block, { BlockProps } from 'components/ui/Block';
import Markdown from 'components/ui/Markdown';

import { Update } from 'api/updates/types';

export interface UpdateDisplayProps extends Omit<BlockProps, 'children'> {
  update: Update;
}

function UpdateItem({ update, ...props }: UpdateDisplayProps): ReactElement {
  return (
    <Block {...props} variant='light'>
      <Markdown>{update.description}</Markdown>
    </Block>
  );
}

export default UpdateItem;
