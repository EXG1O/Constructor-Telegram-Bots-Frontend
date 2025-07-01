import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import cn from 'utils/cn';

export interface VariablesInfoTextProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children'> {}

function VariablesInfoText({
  className,
  ...props
}: VariablesInfoTextProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'variablesInfoText',
  });

  return (
    <small {...props} className={cn('w-full', 'text-xs', 'text-muted', className)}>
      {t('text')}
    </small>
  );
}

export default VariablesInfoText;
