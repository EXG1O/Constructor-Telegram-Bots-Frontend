import { Connection } from '../connection/types';

export interface DiagramBlock {
  x: number;
  y: number;
  source_connections: Connection[];
  target_connections: Connection[];
}
