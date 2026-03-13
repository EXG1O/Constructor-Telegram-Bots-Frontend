import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { create } from 'zustand';

import { DEFAULT_SIZE, type Size } from '.';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

import type { Editor } from '.';

export interface StateData {
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

export type State = BaseState<StoreProps> & StateData & StateActions;

export interface StoreProps extends Partial<Omit<StateData, 'editor'>> {}

function getData({
  size = DEFAULT_SIZE,
  invalid = false,
  ...rest
}: StoreProps): Omit<StateData, 'editor'> {
  return { ...rest, size, invalid };
}

export const [CodeInputStoreProvider, useCodeInputStore] = createZustandContext(
  (props: StoreProps) =>
    create<State>((set) => ({
      ...getData(props),

      editor: null,

      syncFromProps: (props) => set(getData(props)),

      setEditor: (editor) => set({ editor }),
    })),
);
