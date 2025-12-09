import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import HeaderLink from './HeaderLink';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export interface HeaderLinksProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function HeaderLinks({ className, ...props }: HeaderLinksProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'header.links' });

  return (
    <div
      {...props}
      className={cn(
        'xl:col-span-2',
        'flex',
        'flex-nowrap',
        'max-lg:w-[calc(100%-var(--spacing)*11.5)]',
        '2xl:justify-center',
        'items-center',
        'overflow-x-auto',
        'scrollbar-thin',
        className,
      )}
    >
      <HeaderLink to={reverse(RouteID.Instruction)}>{t('instruction')}</HeaderLink>
      <HeaderLink to={reverse(RouteID.PrivacyPolicy)}>{t('privacyPolicy')}</HeaderLink>
      <HeaderLink to={reverse(RouteID.TermsOfService)}>
        {t('termsOfService')}
      </HeaderLink>
      <HeaderLink to={reverse(RouteID.Donation)}>{t('donation')}</HeaderLink>
    </div>
  );
}

export default HeaderLinks;
