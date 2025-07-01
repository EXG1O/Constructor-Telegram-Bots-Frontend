import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import { Parts } from '..';

import SelectFeedback, { SelectFeedbackProps } from 'components/shared/SelectFeedback';

import { defaultPart, Part } from './PartItem';

export type NextPartOperator = '&&' | '||' | 'null';

export interface NextPartOperatorSelectProps
  extends Omit<SelectFeedbackProps, 'size' | 'children'> {
  index: number;
}

const nextPartOperators: NextPartOperator[] = ['&&', '||'];

export const defaultNextPartOperator: NextPartOperator = 'null';

function NextPartOperatorSelect({
  index,
  ...props
}: NextPartOperatorSelectProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas.partsBlock.nextPartOperatorSelect',
  });

  const [{ value: parts }, _meta, { setValue: setParts }] = useField<Parts>('parts');
  const [field, meta] = useField<NextPartOperator>({
    name: `parts[${index}].next_part_operator`,
    ...props,
  });

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setParts(
      produce(parts, (draft) => {
        const part: Part = draft[index];
        const operator = event.target.value as NextPartOperator;

        if (operator === 'null') {
          draft.splice(draft.length - 1, 1);
        } else if (part.next_part_operator === 'null') {
          draft.push(defaultPart);
        }

        part.next_part_operator = operator;
      }),
    );
  }

  return (
    <SelectFeedback
      {...props}
      {...field}
      size='sm'
      error={meta.error}
      onChange={handleChange}
    >
      <option value='null'>-</option>
      {nextPartOperators.map((nextPartOperator, index) => (
        <option key={index} value={nextPartOperator}>
          {t(nextPartOperator)}
        </option>
      ))}
    </SelectFeedback>
  );
}

export default NextPartOperatorSelect;
