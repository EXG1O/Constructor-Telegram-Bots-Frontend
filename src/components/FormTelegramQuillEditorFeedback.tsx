import React, { memo, ReactElement, useMemo } from 'react';
import Quill from 'quill';

import FormQuillEditorFeedback, {
  FormQuillEditorFeedbackProps,
} from './FormQuillEditorFeedback';
import { Toolbar } from './QuillEditor';

import('./FormTelegramQuillEditorFeedback.scss');

const Inline = Quill.import('blots/inline');

class SpoilerBlot extends Inline {
  static blotName = 'spoiler';
  static tagName = 'tg-spoiler';
}

Quill.register(SpoilerBlot);

export interface FormTelegramQuillEditorFeedbackProps
  extends Omit<FormQuillEditorFeedbackProps, 'toolbar'> {
  toolbar?: Toolbar;
}

const baseToolbar: Toolbar = {
  container: [
    'bold',
    'italic',
    'underline',
    'strike',
    'link',
    'code',
    'code-block',
    'blockquote',
    'spoiler',
    'clean',
  ],
};

function FormTelegramQuillEditorFeedback({
  toolbar,
  ...props
}: FormTelegramQuillEditorFeedbackProps): ReactElement<FormTelegramQuillEditorFeedbackProps> {
  return (
    <FormQuillEditorFeedback
      {...props}
      toolbar={useMemo(
        () =>
          toolbar
            ? {
                ...toolbar,
                container: {
                  ...baseToolbar.container,
                  ...toolbar.container,
                },
              }
            : baseToolbar,
        [toolbar],
      )}
    />
  );
}

export default memo(FormTelegramQuillEditorFeedback);
