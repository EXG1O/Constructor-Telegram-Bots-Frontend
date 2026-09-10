import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { RouteID } from 'routes';

import FooterLink from './FooterLink';

import { DocumentType } from 'api/legal/enums';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export interface FooterLinksProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function FooterLinks({ className, ...props }: FooterLinksProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'footer.links' });

  const location = useLocation();

  return (
    <div
      {...props}
      className={cn(
        'w-full',
        'flex',
        'justify-center',
        'items-center',
        'gap-2',
        className,
      )}
    >
      <FooterLink
        to={reverse(RouteID.Legal, {
          params: { type: DocumentType.TermsOfService },
          location,
        })}
      >
        {t('termsOfService')}
      </FooterLink>
      <FooterLink
        to={reverse(RouteID.Legal, {
          params: { type: DocumentType.PrivacyPolicy },
          location,
        })}
      >
        {t('privacyPolicy')}
      </FooterLink>
    </div>
  );
}

export default FooterLinks;
