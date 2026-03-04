import type { NextPartOperator } from '../NextPartOperatorSelect/types';
import type { Operator } from '../OperatorSelect/types';

export interface Part {
  id?: number;
  type: '-' | '+';
  first_value: string;
  operator: Operator;
  second_value: string;
  next_part_operator: NextPartOperator;
}
