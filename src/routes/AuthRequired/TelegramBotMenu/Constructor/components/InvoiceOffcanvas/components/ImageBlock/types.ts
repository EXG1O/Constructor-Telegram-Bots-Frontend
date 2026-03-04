export interface Image {
  file: File | null;
  file_url: string | null;
  from_url: string | null;
}

export interface ImageBlockFormValues {
  image: Image | null;
}
