export interface Document {
  content: string;
  updated_date: string;
}

export namespace APIResponse {
  export namespace DocumentAPI {
    export type Get = Document;
  }
}
