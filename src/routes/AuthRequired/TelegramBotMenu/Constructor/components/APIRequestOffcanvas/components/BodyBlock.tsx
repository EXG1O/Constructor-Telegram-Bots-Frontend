import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import VariablesInfoText from '../../VariablesInfoText';

import cn from 'utils/cn';

export type Body = string;

export interface BodyBlockFormValues {
  body: Body;
}

export interface BodyBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 2);
export const defaultBodyBlockFormValues: BodyBlockFormValues = {
  body: defaultBody,
};

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

function BodyBlock({ className, ...props }: BodyBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.bodyBlock',
  });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <div>
        <FormCodeInputFeedback name='body' language='json' options={monacoOptions} />
        <VariablesInfoText />
      </div>
    </Block>
  );
}

export default BodyBlock;
