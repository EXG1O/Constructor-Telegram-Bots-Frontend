import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback, {
  FormSelectFeedbackProps,
} from 'components/shared/FormSelectFeedback';

import cn from 'utils/cn';

export type Operator = '==' | '!=' | '>' | '>=' | '<' | '<=';

export interface OperatorSelectProps
  extends Omit<FormSelectFeedbackProps, 'size' | 'name' | 'children'> {
  index: number;
}

const operators: Operator[] = ['==', '!=', '>', '>=', '<', '<='];

export const defaultOperator: Operator = '==';

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
