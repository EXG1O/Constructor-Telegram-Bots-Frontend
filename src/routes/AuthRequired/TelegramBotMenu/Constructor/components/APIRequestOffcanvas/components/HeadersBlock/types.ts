export interface Header {
  key: string;
  value: string;
}
export type Headers = Header[];

export interface HeadersBlockFormValues {
  headers: Headers;
}
