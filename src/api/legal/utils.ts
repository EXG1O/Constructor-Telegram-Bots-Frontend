import { DocumentType } from './enums';

export function isDocumentType(value: any): value is DocumentType {
  return Object.values(DocumentType).includes(value);
}
