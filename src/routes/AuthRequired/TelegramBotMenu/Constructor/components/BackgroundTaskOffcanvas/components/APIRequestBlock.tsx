import React, { ReactElement } from 'react';

import BaseAPIRequestBlock, {
  APIRequest,
  APIRequestBlockProps as BaseAPIRequestBlockProps,
  defaultAPIRequest,
} from '../../APIRequestBlock';
import FormToggleSection from '../../FormToggleSection';

export type { APIRequest };
export { defaultAPIRequest };

export interface APIRequestBlockProps extends BaseAPIRequestBlockProps {}

function APIRequestBlock(props: APIRequestBlockProps): ReactElement {
  return (
    <FormToggleSection name='show_api_request_block'>
      <BaseAPIRequestBlock {...props} />
    </FormToggleSection>
  );
}

export default APIRequestBlock;
