export interface Image {
  id?: number;
  key: string;
  file: File | null;
  file_url: string | null;
  from_url: string | null;
}

export type Images = Image[];

export interface ImagesBlockFormValues {
  images: Images;
}
