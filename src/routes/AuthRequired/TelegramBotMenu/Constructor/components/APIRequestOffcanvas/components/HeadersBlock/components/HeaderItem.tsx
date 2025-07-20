import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { RouteID } from 'routes';

import { Headers } from '..';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface HeaderItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function HeaderItem({ index, className, ...props }: HeaderItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.headersBlock',
  });

  const [{ value: headers }, _meta, { setValue: setHeaders }] =
    useField<Headers>('headers');

  function handleDeleteClick(): void {
    setHeaders(
      produce(headers, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <div {...props} className={cn('flex', 'w-full', 'gap-1', className)}>
      <div className='inline-flex flex-auto'>
        <FormInputFeedback
          size='sm'
          name={`headers[${index}].key`}
          placeholder={t('keyInput.placeholder')}
          className='relative rounded-e-none focus:z-1'
        />
        <FormInputFeedback
          size='sm'
          name={`headers[${index}].value`}
          placeholder={t('valueInput.placeholder')}
          className='relative -ms-px rounded-s-none'
        />
      </div>
      <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
        <Trash2 />
      </IconButton>
    </div>
  );
}

export default HeaderItem;
