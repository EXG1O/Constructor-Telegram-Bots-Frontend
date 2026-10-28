import type { ActionMessageDeletionRequest } from 'api';

export type MessageDeletion = ActionMessageDeletionRequest;

export interface MessageDeletionBlockFormValues {
  message_deletion: MessageDeletion;
}
