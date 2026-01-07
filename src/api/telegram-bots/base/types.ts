import { Connection } from '../connection/types';

export interface Media {
  name: string | null;
  size: number | null;
  url: string | null;
  from_url: string | null;
}

export interface DiagramBlock<IDType = any> {
  id: IDType;
  name: string;
  x: number;
  y: number;
  source_connections: Connection[];
}
