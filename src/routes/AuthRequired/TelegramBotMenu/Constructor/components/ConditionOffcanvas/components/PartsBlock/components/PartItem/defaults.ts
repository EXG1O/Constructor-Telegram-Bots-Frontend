import { defaultNextPartOperator } from '../NextPartOperatorSelect/defaults';
import { defaultOperator } from '../OperatorSelect/defaults';

import type { Part } from './types';

export const defaultPart: Part = {
  type: '+',
  first_value: '',
  operator: defaultOperator,
  second_value: '',
  next_part_operator: defaultNextPartOperator,
};
