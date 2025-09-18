import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FastField, FastFieldProps, FieldInputProps, FormikProps } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { RouteID } from 'routes';

import { Headers } from '..';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import IconButton from 'components/ui/IconButton';
import SimpleInput from 'components/ui/SimpleInput';

import cn from 'utils/cn';

export interface HeaderItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function HeaderItem({ index, className, ...props }: HeaderItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.headersBlock',
  });

  function handleDeleteClick(
    form: FormikProps<any>,
    field: FieldInputProps<Headers>,
  ): void {
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <div {...props} className={cn('flex', 'w-full', 'gap-1', className)}>
      <div className='inline-flex flex-auto'>
        <FormSimpleInputFeedback
          size='sm'
          name={`headers[${index}].key`}
          placeholder={t('keyInput.placeholder')}
        >
          <SimpleInput.Container className='relative rounded-e-none focus:z-1'>
            <SimpleInput.Editor />
          </SimpleInput.Container>
        </FormSimpleInputFeedback>
        <FormSimpleInputFeedback
          size='sm'
          name={`headers[${index}].value`}
          placeholder={t('valueInput.placeholder')}
        >
          <SimpleInput.Container className='relative -ms-px rounded-s-none'>
            <SimpleInput.Editor />
          </SimpleInput.Container>
        </FormSimpleInputFeedback>
      </div>
      <FastField name='headers'>
        {({ field, form }: FastFieldProps) => (
          <IconButton
            size='sm'
            className='text-danger'
            onClick={() => handleDeleteClick(form, field)}
          >
            <Trash2 />
          </IconButton>
        )}
      </FastField>
    </div>
  );
}

export default memo(HeaderItem);
