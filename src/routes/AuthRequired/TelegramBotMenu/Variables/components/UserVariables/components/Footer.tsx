import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import useUserVariablesStore from '../hooks/useUserVariablesStore';

import cn from 'utils/cn';

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {}

function Footer({ className, ...props }: FooterProps): ReactElement | null {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.footer',
  });

  const variableCount = useUserVariablesStore((state) => state.count);

  return variableCount ? (
    <small
      {...props}
      className={cn('w-full', 'text-end', 'text-xs', 'text-muted', className)}
    >
      {t('variableCount', { count: variableCount })}
    </small>
  ) : null;
}

export default Footer;
