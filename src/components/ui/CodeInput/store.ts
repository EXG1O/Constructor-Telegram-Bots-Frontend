import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { create } from 'zustand';

import { DEFAULT_SIZE, Size } from '.';
import { Editor } from '.';

export interface StateParams {
  editor: Editor | null;

  size: Size;
  invalid: boolean;

  value?: string;
  language?: string;
  saveViewState?: boolean;
  keepCurrentModel?: boolean;
  options?: editor.IStandaloneEditorConstructionOptions;
  beforeMount?: (monaco: Monaco) => void;
  onMount?: (editor: Editor, monaco: Monaco) => void;
  onChange?: (editor: Editor, value: string) => void;
  onValidate?: (markers: editor.IMarker[]) => void;
}

export interface StateActions {
  setEditor: (editor: Editor) => void;
}

export type State = StateParams & StateActions;
export type StateProps = Partial<Pick<StateParams, 'size' | 'invalid' | 'options'>> &
  Pick<
    StateParams,
    | 'value'
    | 'language'
    | 'saveViewState'
    | 'keepCurrentModel'
    | 'beforeMount'
    | 'onMount'
    | 'onChange'
    | 'onValidate'
  >;

export function createStore({
  size = DEFAULT_SIZE,
  invalid = false,
  ...props
}: StateProps) {
  return create<State>((set) => ({
    ...props,

    editor: null,

    size,
    invalid,

    setEditor: (editor) => set({ editor }),
  }));
}
