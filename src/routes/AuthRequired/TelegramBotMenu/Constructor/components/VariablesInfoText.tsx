import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import cn from 'utils/cn';

export interface VariablesInfoTextProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {}

function VariablesInfoText({
  className,
  ...props
}: VariablesInfoTextProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'variablesInfoText',
  });

  return (
    <span {...props} className={cn('w-full', 'text-xs', 'text-muted', className)}>
      {t('text')}
    </span>
  );
}

export default VariablesInfoText;
