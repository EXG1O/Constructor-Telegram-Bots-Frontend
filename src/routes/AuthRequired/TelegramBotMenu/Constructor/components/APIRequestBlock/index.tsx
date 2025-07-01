import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import APIRequestBody, { Body, defaultBody } from './components/APIRequestBody';
import APIRequestHeaders, {
  defaultHeaders,
  Headers,
} from './components/APIRequestHeaders';
import APIRequestMethods, {
  defaultMethod,
  Method,
} from './components/APIRequestMethods';
import APIRequestTest from './components/APIRequestTest';

export interface APIRequest {
  url: string;
  method: Method;
  headers: Headers;
  body: Body;
}

export interface APIRequestBlockProps
  extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultAPIRequest: APIRequest = {
  url: '',
  method: defaultMethod,
  headers: defaultHeaders,
  body: defaultBody,
};

function APIRequestBlock(props: APIRequestBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock',
  });

  return (
    <Block {...props} variant='light'>
      <Block.Title>
        <h3 className='mb-2 text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <FormInputFeedback
        name='api_request.url'
        placeholder={t('urlInputPlaceholder')}
        wrapperProps={{ className: 'mb-2' }}
      />
      <APIRequestMethods className='mb-2' />
      <APIRequestHeaders.ToggleSection className='mb-2'>
        <APIRequestHeaders />
      </APIRequestHeaders.ToggleSection>
      <APIRequestBody.ToggleSection>
        <APIRequestBody.ToggleInnerSection className='mb-2'>
          <APIRequestBody />
        </APIRequestBody.ToggleInnerSection>
      </APIRequestBody.ToggleSection>
      <APIRequestTest />
    </Block>
  );
}

export default APIRequestBlock;
