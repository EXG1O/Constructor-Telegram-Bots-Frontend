import React, {
  HTMLAttributes,
  memo,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import Collapse from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/ui/Button';
import FormMonacoEditorFeedback, {
  FormMonacoEditorFeedbackProps,
} from 'components/shared/FormMonacoEditorFeedback';
import { Editor } from 'components/ui/MonacoEditor';

import BlockCollapse from './components/BlockCollapse';

import VariablesInfoText from '../../../VariablesInfoText';

export type Body = string;

export type BodyBlockProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

type EditorMountHandler = NonNullable<FormMonacoEditorFeedbackProps['onMount']>;

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 4);

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

function BodyBlock(props: BodyBlockProps): ReactElement<BodyBlockProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestBlock.bodyBlock',
  });

  const editorRef = useRef<Editor | undefined>(undefined);

  const [{ value: show }, _meta, { setValue }] = useField<boolean>(
    'show_api_request_body_block',
  );

  const showButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'dark',
      className: 'w-100',
      children: t('showButton'),
    }),
    [i18n.language],
  );
  const hideButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'secondary',
      className: 'w-100 border-bottom-0 rounded-bottom-0',
      children: t('hideButton'),
    }),
    [i18n.language],
  );

  function handleButtonClick(): void {
    setValue(!show);
  }

  function handleCollapseEnter(): void {
    editorRef.current?.updateLayout();
  }

  const handleEditorMount = useCallback<EditorMountHandler>(
    (editor) => {
      editorRef.current = editor;
    },
    [editorRef],
  );

  return (
    <BlockCollapse>
      <div {...props}>
        <Button
          size='sm'
          {...(show ? hideButtonProps : showButtonProps)}
          onClick={handleButtonClick}
        />
        <Collapse in={show} onEnter={handleCollapseEnter}>
          <div>
            <FormMonacoEditorFeedback
              size='sm'
              language='json'
              name='api_request.body'
              options={monacoOptions}
              className='border-top-0 rounded-top-0'
              onMount={handleEditorMount}
            />
            <VariablesInfoText />
          </div>
        </Collapse>
      </div>
    </BlockCollapse>
  );
}

export default memo(BodyBlock);
