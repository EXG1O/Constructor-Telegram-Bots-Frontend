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

import FormToggleSection from '../FormToggleSection';

export interface APIRequest {
  url: string;
  method: Method;
  headers: Headers;
  body: Body;
}

export interface APIRequestBlockFormValues {
  api_request: APIRequest;
  show_api_request_headers: boolean;
  show_api_request_body: boolean;
}

export interface APIRequestBlockProps
  extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultAPIRequest: APIRequest = {
  url: '',
  method: defaultMethod,
  headers: defaultHeaders,
  body: defaultBody,
};
export const defaultAPIRequestBlockFormValues: APIRequestBlockFormValues = {
  api_request: defaultAPIRequest,
  show_api_request_headers: false,
  show_api_request_body: defaultAPIRequest.method !== 'get',
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
      <FormToggleSection
        advanced
        name='show_api_request_headers'
        className='mb-2 w-full'
      >
        <FormToggleSection.TriggerButton
          size='sm'
          openProps={{ children: t('headers.hideButton') }}
          closedProps={{ children: t('headers.showButton') }}
        />
        <FormToggleSection.Body>
          <APIRequestHeaders />
        </FormToggleSection.Body>
      </FormToggleSection>
      <FormToggleSection
        name='api_request.method'
        getOpen={(method: Method) => method !== 'get'}
        className='w-full'
      >
        <FormToggleSection
          advanced
          name='show_api_request_body'
          className='mb-2 w-full'
        >
          <FormToggleSection.TriggerButton
            size='sm'
            openProps={{ children: t('body.hideButton') }}
            closedProps={{ children: t('body.showButton') }}
          />
          <FormToggleSection.Body>
            <APIRequestBody />
          </FormToggleSection.Body>
        </FormToggleSection>
      </FormToggleSection>
      <APIRequestTest />
    </Block>
  );
}

export default APIRequestBlock;
