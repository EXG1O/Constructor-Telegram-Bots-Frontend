import { DocumentType } from '..';

function isDocumentType(value: any): value is DocumentType {
  return Object.values(DocumentType).includes(value);
}

export default isDocumentType;
