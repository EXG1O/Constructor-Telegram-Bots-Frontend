import type { Connection } from '../connection/types';

export interface Block<IDType = any> {
  id: IDType;
  name: string;
}

export interface CreateBlock extends Omit<Block, 'id'> {
  x?: number;
  y?: number;
}

export interface Media {
  name: string | null;
  size: number | null;
  url: string | null;
  from_url: string | null;
}

export interface DiagramBlock<IDType = any> extends Block<IDType> {
  x: number;
  y: number;
  source_connections: Connection[];
}
