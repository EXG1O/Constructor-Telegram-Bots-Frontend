import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { RouteID } from 'routes';

import HeaderLink from './HeaderLink';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export interface HeaderLinksProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function HeaderLinks({ className, ...props }: HeaderLinksProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'header.links' });

  const location = useLocation();

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
      <HeaderLink to={reverse(RouteID.Instruction, { location })}>
        {t('instruction')}
      </HeaderLink>
      <HeaderLink to={reverse(RouteID.PrivacyPolicy, { location })}>
        {t('privacyPolicy')}
      </HeaderLink>
      <HeaderLink to={reverse(RouteID.TermsOfService, { location })}>
        {t('termsOfService')}
      </HeaderLink>
      <HeaderLink to={reverse(RouteID.Donation, { location })}>
        {t('donation')}
      </HeaderLink>
    </div>
  );
}

export default HeaderLinks;
