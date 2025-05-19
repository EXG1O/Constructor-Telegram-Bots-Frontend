import React, { CSSProperties, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import { Header } from '..';

import Button from 'components/ui/Button';
import FormInputFeedback from 'components/shared/FormInputFeedback';
import InputGroup, { InputGroupProps } from 'components/InputGroup';

import TrashIcon from 'assets/icons/trash.svg';

export interface HeaderDetailProps extends Pick<InputGroupProps, 'className'> {
  index: number;
}

const deleteButtonStyle: CSSProperties = {
  width: '31px',
  height: '31px',
  fontSize: '18px',
};

function HeaderDetail({
  index,
  ...props
}: HeaderDetailProps): ReactElement<HeaderDetailProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock.headersBlock.headerInputGroup',
  });

  const [{ value: headers }, _meta, { setValue }] =
    useField<Header[]>('api_request.headers');

  function handleClick() {
    setValue(
      produce(headers, (draft) => {
        draft.splice(index, 1);
      }),
    );
  }

  return (
    <InputGroup {...props} size='sm'>
      <FormInputFeedback
        name={`api_request.headers[${index}].key`}
        placeholder={t('keyInputPlaceholder')}
      />
      <FormInputFeedback
        name={`api_request.headers[${index}].value`}
        placeholder={t('valueInputPlaceholder')}
      />
      <Button
        variant='danger'
        className='d-flex justify-content-center align-items-center p-0'
        style={deleteButtonStyle}
        onClick={handleClick}
      >
        <TrashIcon width={18} height={18} />
      </Button>
    </InputGroup>
  );
}

export default memo(HeaderDetail);
