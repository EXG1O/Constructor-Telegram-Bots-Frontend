import React, { ChangeEvent, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FastField, FastFieldProps, FormikProps } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import { Parts } from '..';

import SelectFeedback, { SelectFeedbackProps } from 'components/shared/SelectFeedback';

import { defaultPart, Part } from './PartItem';

import { FormValues } from '../../..';

export type NextPartOperator = '&&' | '||' | 'null';

export interface NextPartOperatorSelectProps
  extends Omit<SelectFeedbackProps, 'size' | 'value' | 'error' | 'children'> {
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

  function handleChange(
    form: FormikProps<FormValues>,
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const field = form.getFieldProps<Parts>('parts');
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
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
    <FastField name={`parts[${index}].next_part_operator`}>
      {({ field, meta, form }: FastFieldProps) => (
        <SelectFeedback
          {...props}
          size='sm'
          value={field.value}
          error={meta.error}
          onChange={(event) => handleChange(form, event)}
        >
          <option value='null'>-</option>
          {nextPartOperators.map((nextPartOperator, index) => (
            <option key={index} value={nextPartOperator}>
              {t(nextPartOperator)}
            </option>
          ))}
        </SelectFeedback>
      )}
    </FastField>
  );
}

export default NextPartOperatorSelect;
