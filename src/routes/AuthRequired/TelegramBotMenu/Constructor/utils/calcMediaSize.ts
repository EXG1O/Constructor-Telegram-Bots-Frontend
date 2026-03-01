export interface Media {
  file: File | null;
}

function calcMediaSize(media: Media[]): number {
  return media
    .filter((item) => item.file !== null)
    .reduce((totalSize, item) => totalSize + item.file!.size, 0);
}

export default calcMediaSize;
