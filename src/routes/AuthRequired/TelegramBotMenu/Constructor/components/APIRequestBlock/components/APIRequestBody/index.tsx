import React, { HTMLAttributes, ReactElement } from 'react';
import monaco from 'monaco-editor';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';

import ToggleInnerSection from './components/ToggleInnerSection';
import ToggleSection from './components/ToggleSection';

import VariablesInfoText from '../../../VariablesInfoText';

export type Body = string;

export interface APIRequestBodyProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 2);

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

function APIRequestBody(props: APIRequestBodyProps): ReactElement {
  return (
    <div {...props}>
      <FormCodeInputFeedback
        size='sm'
        language='json'
        name='api_request.body'
        options={monacoOptions}
        className='rounded-t-none border-t-0'
      />
      <VariablesInfoText />
    </div>
  );
}

export default Object.assign(APIRequestBody, { ToggleSection, ToggleInnerSection });
