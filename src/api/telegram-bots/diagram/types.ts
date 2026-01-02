import { Connection } from '../connection/types';

export interface DiagramBlock<IDType = any> {
  id: IDType;
  name: string;
  x: number;
  y: number;
  source_connections: Connection[];
}
