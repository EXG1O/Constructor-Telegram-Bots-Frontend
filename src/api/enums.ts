import {
  ConnectionSourceObjectType,
  ConnectionTargetObjectType,
  type LegalGetDocumentData,
} from './client';

export enum DocumentType {
  TermsOfService = 'terms-of-service',
  PrivacyPolicy = 'privacy-policy',
}

type ValidateEnum<T extends LegalGetDocumentData['path']['type']> = T;
type _AssertDocumentType = ValidateEnum<DocumentType>;

export const ConnectionObjectType = {
  ...ConnectionSourceObjectType,
  ...ConnectionTargetObjectType,
} as const;
export type ConnectionObjectType =
  ConnectionSourceObjectType | ConnectionTargetObjectType;
