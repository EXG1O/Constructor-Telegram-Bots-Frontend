import React, { forwardRef, type HTMLAttributes } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useLocation, useMatches } from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import Container from 'components/ui/Container';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export const pageVariants = cva(['my-2', 'lg:my-3'], {
  variants: {
    flex: {
      true: ['flex', 'flex-col'],
    },
    grid: {
      true: ['grid'],
    },
    gutters: {
      true: ['gap-3', 'lg:gap-4'],
    },
  },
});

export interface PageProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof pageVariants> {
  asChild?: boolean;
  public?: boolean;
  title: string;
}

const Page = forwardRef<HTMLElement, PageProps>(
  (
    { asChild, public: isPublic, title, flex, grid, gutters, className, ...props },
    ref,
  ) => {
    const { t } = useTranslation();

    const routeLocation = useLocation();
    const routeMatches = useMatches();
    const route = routeMatches[routeMatches.length - 1];
    const routeParams = route.params;

    const fullTitle: string = `${title} - Constructor Telegram Bots`;
    const description: string = t('seo.description');
    const absoluteURL: string = window.location.origin + routeLocation.pathname;

    const Component = asChild ? Slot : 'main';

    return (
      <>
        <Helmet>
          <title>{fullTitle}</title>
          <meta
            name='robots'
            content={isPublic ? 'index, follow' : 'noindex, nofollow'}
          />
        </Helmet>
        {isPublic && (
          <Helmet>
            <meta name='description' content={description} />

            <link rel='canonical' href={absoluteURL} />

            <link
              rel='alternate'
              hrefLang='en'
              href={
                window.location.origin +
                reverse(route.id, {
                  params: { ...routeParams, lang: null },
                  location: routeLocation,
                })
              }
            />
            <link
              rel='alternate'
              hrefLang='uk'
              href={
                window.location.origin +
                reverse(route.id, {
                  params: { ...routeParams, lang: 'uk' },
                  location: routeLocation,
                })
              }
            />
            <link
              rel='alternate'
              hrefLang='ru'
              href={
                window.location.origin +
                reverse(route.id, {
                  params: { ...routeParams, lang: 'ru' },
                  location: routeLocation,
                })
              }
            />
            <link
              rel='alternate'
              hrefLang='x-default'
              href={
                window.location.origin +
                reverse(route.id, {
                  params: { ...routeParams, lang: null },
                  location: routeLocation,
                })
              }
            />

            <meta property='og:type' content='website' />
            <meta property='og:title' content={fullTitle} />
            <meta property='og:description' content={description} />
            <meta property='og:url' content={absoluteURL} />

            <meta name='twitter:title' content={fullTitle} />
            <meta name='twitter:description' content={description} />
          </Helmet>
        )}
        <Container asChild>
          <Component
            {...props}
            ref={ref}
            className={cn(pageVariants({ flex, grid, gutters, className }))}
          />
        </Container>
      </>
    );
  },
);
Page.displayName = 'Page';

export default Page;
