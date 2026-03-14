import React, { type ReactElement } from 'react';

import APITokenDisplay, {
  type APITokenDisplayProps,
} from './components/APITokenDisplay';
import APITokenEditing, {
  type APITokenEditingProps,
} from './components/APITokenEditing';

import { useTelegramBotContentStore } from '../../store';

export interface APITokenProps extends APITokenDisplayProps, APITokenEditingProps {}

function APIToken(props: APITokenProps): ReactElement {
  const isEditing = useTelegramBotContentStore((state) => state.isEditingAPIToken);

  return isEditing ? <APITokenEditing {...props} /> : <APITokenDisplay {...props} />;
}

export default APIToken;
