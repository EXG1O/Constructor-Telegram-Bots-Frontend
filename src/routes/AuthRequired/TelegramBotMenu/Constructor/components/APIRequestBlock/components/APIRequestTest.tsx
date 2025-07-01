import React, { HTMLAttributes, ReactElement, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { APIRequest } from '..';

import Button from 'components/ui/Button';
import Collapsible from 'components/ui/Collapsible';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import cn from 'utils/cn';

export interface APIRequestTestProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

interface Result {
  status: number;
  body: string;
}

function APIRequestTest({ className, ...props }: APIRequestTestProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock.testBlock',
  });

  const statusID = useId();

  const [{ value: request }] = useField<APIRequest>('api_request');

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const open: boolean = loading || Boolean(result);

  async function handleClick(): Promise<void> {
    setLoading(true);

    try {
      if (!request.url) {
        createMessageToast({
          message: t('messages.makeTest.error', { context: 'emptyURL' }),
          level: 'error',
        });
        return;
      }

      try {
        new URL(request.url);
      } catch {
        createMessageToast({
          message: t('messages.makeTest.error', { context: 'validURL' }),
          level: 'error',
        });
        return;
      }

      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers.map<[string, string]>((header) => [
            header.key,
            header.value,
          ]),
          body: request.method !== 'get' ? request.body : undefined,
        });

        setResult({ status: response.status, body: await response.text() });
      } catch {
        createMessageToast({
          message: t('messages.makeTest.error'),
          level: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Collapsible open={open}>
      <Button
        size='sm'
        variant='dark'
        className={cn('w-full', open && 'rounded-b-none')}
        onClick={handleClick}
      >
        {t('testButton')}
      </Button>
      <Collapsible.Body>
        <Slot
          {...props}
          className={cn(
            'w-full',
            'bg-light-accent',
            'text-light-foreground',
            'rounded-sm',
            'rounded-t-none',
          )}
        >
          {!loading ? (
            result && (
              <div className='px-2 py-1'>
                <div className='flex w-full items-center gap-1'>
                  <label
                    htmlFor={statusID}
                    className={cn(
                      'size-2.5',
                      'rounded-full',
                      result.status <= 399 ? 'bg-success' : 'bg-danger',
                    )}
                  ></label>
                  <span id={statusID} className='text-sm font-medium'>
                    {result.status}
                  </span>
                </div>
                <code className='font-mono text-xs'>{result.body}</code>
              </div>
            )
          ) : (
            <div className='flex justify-center p-2'>
              <Spinner size='sm' />
            </div>
          )}
        </Slot>
      </Collapsible.Body>
    </Collapsible>
  );
}

export default APIRequestTest;
