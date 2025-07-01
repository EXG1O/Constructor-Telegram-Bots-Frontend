import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import FormToggleSection from '../../FormToggleSection';
import VariablesInfoText from '../../VariablesInfoText';

import cn from 'utils/cn';

export interface DatabaseRecord {
  data: string;
}

export interface DatabaseRecordBlockProps
  extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultDatabaseRecord: DatabaseRecord = {
  data: JSON.stringify({ key: 'value' }, undefined, 2),
};

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

function DatabaseRecordBlock({
  className,
  ...props
}: DatabaseRecordBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.databaseRecordBlock',
  });

  return (
    <FormToggleSection name='show_database_block'>
      <Block
        {...props}
        variant='light'
        className={cn('flex', 'flex-col', 'gap-2', className)}
      >
        <h3 className='w-full text-center text-lg font-medium'>{t('title')}</h3>
        <div>
          <FormCodeInputFeedback
            language='json'
            name='database_record.data'
            options={monacoOptions}
          />
          <VariablesInfoText />
        </div>
      </Block>
    </FormToggleSection>
  );
}

export default DatabaseRecordBlock;
