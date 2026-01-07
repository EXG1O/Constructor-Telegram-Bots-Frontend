async function fetchFile(url: string, fileName: string): Promise<File> {
  const response: Response = await fetch(url);
  const blob: Blob = await response.blob();
  return new File([blob], fileName);
}

export default fetchFile;
