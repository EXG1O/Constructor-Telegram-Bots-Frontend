import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import VariablesInfoText from '../../VariablesInfoText';

import cn from 'utils/cn';

export interface DatabaseRecord {
  data: string;
}

export interface DatabaseRecordBlockFormValues {
  database_record: DatabaseRecord;
}

export interface DatabaseRecordBlockProps
  extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultDatabaseRecord: DatabaseRecord = {
  data: JSON.stringify({ key: 'value' }, undefined, 2),
};
export const defaultDatabaseRecordBlockFormValues: DatabaseRecordBlockFormValues = {
  database_record: defaultDatabaseRecord,
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
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <div>
        <FormCodeInputFeedback
          language='json'
          name='database_record.data'
          options={monacoOptions}
        />
        <VariablesInfoText />
      </div>
    </Block>
  );
}

export default DatabaseRecordBlock;
