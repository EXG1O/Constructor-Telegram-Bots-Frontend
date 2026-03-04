import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback, {
  type FormSelectFeedbackProps,
} from 'components/shared/FormSelectFeedback';

import cn from 'utils/cn';

import type { Operator } from './types';

export interface OperatorSelectProps extends Omit<
  FormSelectFeedbackProps,
  'size' | 'name' | 'children'
> {
  index: number;
}

const operators: Operator[] = ['==', '!=', '>', '>=', '<', '<='];

function OperatorSelect({
  index,
  className,
  ...props
}: OperatorSelectProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas.partsBlock.operatorSelect',
  });

  return (
    <FormSelectFeedback
      {...props}
      size='sm'
      name={`parts[${index}].operator`}
      className={cn('truncate', className)}
    >
      {operators.map((operator, index) => (
        <option key={index} value={operator}>
          {t(operator)}
        </option>
      ))}
    </FormSelectFeedback>
  );
}

export default OperatorSelect;
