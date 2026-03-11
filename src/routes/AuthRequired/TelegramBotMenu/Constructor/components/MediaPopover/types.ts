import type { URLValue } from './components/URLPopoverBody';

export interface Media {
  file: File | null;
  url: URLValue | null;
}

export interface ResultData {
  url: URLValue | null;
  files: File[] | null;
}
