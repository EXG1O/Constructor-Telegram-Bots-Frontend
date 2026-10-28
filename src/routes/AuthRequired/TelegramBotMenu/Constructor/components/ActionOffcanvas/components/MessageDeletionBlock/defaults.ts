import { ActionMessageDeletionTarget } from 'api';

import type { MessageDeletion, MessageDeletionBlockFormValues } from './types';

export const defaultMessageDeletion: MessageDeletion = {
  target: ActionMessageDeletionTarget.UserMessage,
};
export const defaultMessageDeletionBlockFormValues: MessageDeletionBlockFormValues = {
  message_deletion: defaultMessageDeletion,
};
