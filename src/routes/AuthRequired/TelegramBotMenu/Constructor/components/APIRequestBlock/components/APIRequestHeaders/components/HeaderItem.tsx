import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';
import { Trash2 } from 'lucide-react';

import { RouteID } from 'routes';

import { Header } from '..';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface HeaderItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  index: number;
}

function HeaderItem({ index, className, ...props }: HeaderItemProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock.headers.headerInputGroup',
  });

  const [{ value: headers }, _meta, { setValue: setHeaders }] =
    useField<Header[]>('api_request.headers');

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
          name={`api_request.headers[${index}].key`}
          placeholder={t('keyInputPlaceholder')}
          className='relative rounded-e-none focus:z-1'
        />
        <FormInputFeedback
          size='sm'
          name={`api_request.headers[${index}].value`}
          placeholder={t('valueInputPlaceholder')}
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
