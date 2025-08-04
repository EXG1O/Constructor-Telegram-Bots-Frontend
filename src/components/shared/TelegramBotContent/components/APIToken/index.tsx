import React, { ReactElement } from 'react';

import APITokenDisplay, { APITokenDisplayProps } from './components/APITokenDisplay';
import APITokenEditing, { APITokenEditingProps } from './components/APITokenEditing';

import useTelegramBotContentStore from '../../hooks/useTelegramBotContentStore';

export interface APITokenProps extends APITokenDisplayProps, APITokenEditingProps {}

function APIToken(props: APITokenProps): ReactElement {
  const isEditing = useTelegramBotContentStore((state) => state.isEditingAPIToken);

  return isEditing ? <APITokenEditing {...props} /> : <APITokenDisplay {...props} />;
}

export default APIToken;
