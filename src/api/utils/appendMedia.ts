interface MediaInput extends Record<string, any> {
  file?: File | null;
}

function appendMediaItem(
  formData: FormData,
  name: string,
  { file, ...data }: MediaInput,
  index?: number,
): void {
  if (index !== undefined) {
    name += `:${index}`;
  }

  if (file) {
    formData.append(name, file, file.name);
  }

  formData.append(`${name}:data`, JSON.stringify(data));
}

function appendMedia(
  formData: FormData,
  name: string,
  media: MediaInput[] | MediaInput,
): void {
  if (Array.isArray(media)) {
    media.forEach((item, index) => appendMediaItem(formData, name, item, index));
    return;
  }
  appendMediaItem(formData, name, media);
}

export default appendMedia;
