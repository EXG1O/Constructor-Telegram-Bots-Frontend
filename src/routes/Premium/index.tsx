import React, { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Star } from 'lucide-react';

import type { RouteID } from 'routes';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import LoginButton from 'components/shared/LoginButton';
import Block from 'components/ui/Block';
import Button from 'components/ui/Button';
import Collapsible from 'components/ui/Collapsible';
import List from 'components/ui/List';
import Page from 'components/ui/Page';
import Spinner from 'components/ui/Spinner';
import Tabs from 'components/ui/Tabs';
import { createMessageToast } from 'components/ui/ToastContainer';

import usePremiumRouteLoaderData from './hooks/usePremiumRouteLoaderData';

import { PremiumService } from 'api';

import cn from 'utils/cn';

interface Feature {
  title: string;
  description: string;
}

function Premium(): ReactElement {
  const { t } = useTranslation<`${RouteID.Premium}`, any>('premium');

  const { user } = useRootRouteLoaderData();
  const { prices } = usePremiumRouteLoaderData();

  const [activePriceID, setActivePriceID] = useState<number>(prices[0].id);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const features: Feature[] = [
    {
      title: t('subscription.features.priorityMode.title'),
      description: t('subscription.features.priorityMode.description'),
    },
  ];

  async function handleSubmit(): Promise<void> {
    setLoading(true);

    const { data, error } = await PremiumService.getSubscriptionPriceCheckout({
      path: { id: activePriceID },
    });

    if (error || !data) {
      createMessageToast({
        message: t('messages.getCheckout.error'),
        level: 'error',
      });
    } else {
      window.location.href = data.url;
    }

    setLoading(false);
  }

  function handleChange(value: string): void {
    setActivePriceID(Number(value));
  }

  return (
    <main className='my-auto'>
      <Page asChild public title={t('title')} flex>
        <div className='items-center'>
          <Block variant='light' className='flex max-w-125 flex-col gap-3'>
            <Block.Title>
              <h3 className='-mb-2 text-3xl font-semibold'>{t('title')}</h3>
            </Block.Title>
            <div className='flex flex-col gap-2 px-1'>
              {(t('subscription.description', { returnObjects: true }) as string[]).map(
                (text, index) => (
                  <p key={index} className='w-full text-sm'>
                    {text}
                  </p>
                ),
              )}
            </div>
            <Tabs
              value={activePriceID.toString()}
              className='flex-col'
              onChange={handleChange}
            >
              {prices.map((price) => (
                <Tabs.Button
                  key={price.id}
                  value={price.id.toString()}
                  className='flex items-end justify-between gap-2'
                >
                  <div className='flex flex-wrap-reverse items-center gap-1'>
                    <span className='font-medium text-nowrap'>
                      {t('subscription.period', {
                        months: price.period_months,
                        count: price.period_months,
                      })}
                    </span>
                    {price.badge && (
                      <span
                        className={cn(
                          'bg-primary',
                          'text-primary-foreground',
                          'text-xs',
                          'rounded-sm',
                          'px-1',
                          price.id !== activePriceID && 'opacity-90',
                        )}
                      >
                        {price.badge}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-1'>
                    {price.period_months !== 1 && (
                      <s className='text-sm'>
                        {prices[0].amount_stars_per_month * price.period_months}
                      </s>
                    )}
                    <span>{price.amount_stars}</span>
                    <Star className='fill-warning text-warning' />
                  </div>
                </Tabs.Button>
              ))}
            </Tabs>
            <Collapsible open={open} className='w-full' onOpenChange={setOpen}>
              <Collapsible.Trigger asChild>
                <Button
                  size='sm'
                  variant={open ? 'secondary' : 'dark'}
                  className='w-full data-[state=open]:rounded-b-none'
                >
                  {t('subscription.features.button')}
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Body>
                <List striped>
                  <ul className='w-full overflow-hidden rounded-md rounded-t-none'>
                    {features.map((feature, id) => (
                      <List.Item key={id} className='flex flex-col'>
                        <span className='w-full font-medium'>{feature.title}</span>
                        <span className='w-full text-sm'>{feature.description}</span>
                      </List.Item>
                    ))}
                  </ul>
                </List>
              </Collapsible.Body>
            </Collapsible>
            {user ? (
              <div className='flex w-full flex-col gap-1'>
                <Button
                  variant='dark'
                  disabled={loading}
                  className='w-full'
                  onClick={handleSubmit}
                >
                  {!loading ? (
                    <>
                      <Heart className='fill-danger text-danger' />
                      {user.subscription && !user.subscription.is_expired
                        ? t('subscription.extendButton')
                        : t('subscription.submitButton')}
                    </>
                  ) : (
                    <Spinner size='xs' />
                  )}
                </Button>
                <p className='w-full text-xs text-muted'>
                  {t('subscription.disclaimer')}
                </p>
              </div>
            ) : (
              <LoginButton className='w-full' />
            )}
          </Block>
        </div>
      </Page>
    </main>
  );
}

export default Premium;
