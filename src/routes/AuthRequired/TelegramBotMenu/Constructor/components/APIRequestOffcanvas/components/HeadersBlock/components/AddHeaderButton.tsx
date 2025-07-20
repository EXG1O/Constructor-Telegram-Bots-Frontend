import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { Headers } from '..';

import Button, { ButtonProps } from 'components/ui/Button';

import cn from 'utils/cn';

export interface AddHeaderButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddHeaderButton({
  className,
  onClick,
  ...props
}: AddHeaderButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.headersBlock.addHeaderButton',
  });

  const [{ value: headers }, _meta, { setValue }] = useField<Headers>('headers');

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    setValue([...headers, { key: '', value: '' }]);
  }

  return (
    <Button
      {...props}
      size='sm'
      variant='dark'
      className={cn('w-full', className)}
      onClick={handleClick}
    >
      {t('text')}
    </Button>
  );
}

export default AddHeaderButton;
