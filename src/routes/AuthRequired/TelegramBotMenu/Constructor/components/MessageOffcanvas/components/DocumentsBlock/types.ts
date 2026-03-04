export interface Document {
  id?: number;
  key: string;
  file: File | null;
  from_url: string | null;
}

export type Documents = Document[];

export interface DocumentsBlockFormValues {
  documents: Documents;
}
