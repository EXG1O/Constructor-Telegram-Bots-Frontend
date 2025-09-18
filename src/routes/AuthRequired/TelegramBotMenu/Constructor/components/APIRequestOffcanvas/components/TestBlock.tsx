import React, { ReactElement, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Slot } from '@radix-ui/react-slot';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import { RouteID } from 'routes';

import { FormValues } from '..';

import Block, { BlockProps } from 'components/ui/Block';
import Button from 'components/ui/Button';
import Collapsible from 'components/ui/Collapsible';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { Body } from './BodyBlock';
import { Headers } from './HeadersBlock';
import { Method } from './MethodBlock';
import type { URL } from './URLBlock';

import cn from 'utils/cn';

import { convertHeadersToRecord, getBodyBlockOpen } from '../utils';

export interface TestBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

interface Result {
  status: number;
  body: string;
}

function TestBlock(props: TestBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.testBlock',
  });

  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const statusLabelID = useId();

  const open: boolean = loading || Boolean(result);

  async function handleClick(form: FormikProps<FormValues>): Promise<void> {
    setLoading(true);

    try {
      const url = form.getFieldProps<URL>('url').value;

      if (!url) {
        createMessageToast({
          message: t('messages.makeTest.error', { context: 'emptyURL' }),
          level: 'error',
        });
        return;
      }

      try {
        new URL(url);
      } catch {
        createMessageToast({
          message: t('messages.makeTest.error', { context: 'validURL' }),
          level: 'error',
        });
        return;
      }

      const method = form.getFieldProps<Method>('method').value;
      const headers = form.getFieldProps<Headers>('headers').value;
      const body = form.getFieldProps<Body>('body').value;

      try {
        const response = await fetch(url, {
          method,
          headers: convertHeadersToRecord(headers),
          body: getBodyBlockOpen(method) ? body : undefined,
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
    <Block {...props} variant='light'>
      <Block.Title>
        <h3 className='mb-2 text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <Collapsible open={open}>
        <Collapsible.Body>
          <Slot className='mb-2 w-full'>
            {!loading ? (
              result && (
                <div className='px-2 py-1'>
                  <div className='flex w-full items-center gap-1'>
                    <label
                      htmlFor={statusLabelID}
                      className={cn(
                        'size-2.5',
                        'rounded-full',
                        result.status <= 399 ? 'bg-success' : 'bg-danger',
                      )}
                    ></label>
                    <span id={statusLabelID} className='text-sm font-medium'>
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
      <FastField>
        {({ form }: FastFieldProps) => (
          <Button
            size='sm'
            variant='dark'
            className='w-full'
            onClick={() => handleClick(form)}
          >
            {t('testButton')}
          </Button>
        )}
      </FastField>
    </Block>
  );
}

export default TestBlock;
