import { create } from 'zustand';

import { defaultURL } from './components/URLPopoverBody';

import type { Media, ResultData } from './types';

export interface StateData extends Media {
  mode: 'select' | 'file' | 'url';
  action: 'add' | 'edit';

  onAdd?: (data: ResultData) => void;
  onEdit?: (data: ResultData) => void;

  errors: Record<string, string>;
}

export interface InitializeParams extends Pick<StateData, 'onAdd' | 'onEdit'> {
  media?: Media;
}

export interface StateActions {
  initialize: (params?: InitializeParams) => void;

  toggleMode: (mode: Exclude<StateData['mode'], 'file'>) => void;

  setURL: (url: StateData['url']) => void;
  setErrors: (errors: StateData['errors']) => void;
}

export type State = StateData & StateActions;

function getInitialData(params?: InitializeParams): Omit<StateData, 'open'> {
  const file = params?.media?.file;
  const url = params?.media?.url;

  return {
    mode: file ? 'file' : url ? 'url' : 'select',
    action: file || url ? 'edit' : 'add',

    file: file ?? null,
    url: url ?? null,

    onAdd: params?.onAdd,
    onEdit: params?.onEdit,

    errors: {},
  };
}

export const useMediaPopoverStore = create<State>((set) => ({
  ...getInitialData(),

  initialize: (params) => set(getInitialData(params)),

  toggleMode: (mode) =>
    set({ mode, action: 'add', url: mode === 'url' ? defaultURL : null, errors: {} }),

  setURL: (url) => set({ url }),
  setErrors: (errors) => set({ errors }),
}));
