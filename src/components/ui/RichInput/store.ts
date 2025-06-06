import isEqual from 'lodash/isEqual';
import Quill, { Delta } from 'quill';
import { create } from 'zustand';

export interface StateParams {
  toolbarElement: HTMLDivElement | null;
  editorElement: HTMLDivElement | null;

  height?: string;
  size: 'sm' | 'md' | 'lg';
  invalid: boolean;

  quill: Quill | null;
  readOnly?: boolean;
  formats?: string[] | null;
  placeholder?: string;
  onMount?: (quill: Quill) => void;
  onChange?: (value: Delta) => void;
}

export interface StateActions {
  setToolbarElement: (element: HTMLDivElement | null) => void;
  setEditorElement: (element: HTMLDivElement | null) => void;

  initQuill: () => void;
  setReadOnly: (readOnly: boolean) => void;
  setPlaceholder: (placeholder: string) => void;
}

export type State = StateParams & StateActions;
export type StateProps = Partial<Pick<StateParams, 'size' | 'invalid'>> &
  Pick<
    StateParams,
    'height' | 'readOnly' | 'formats' | 'placeholder' | 'onMount' | 'onChange'
  >;
export type DefaultState = Omit<StateParams, keyof StateProps>;

export const defaultState: DefaultState = {
  toolbarElement: null,
  editorElement: null,
  quill: null,
};

export function createStore({
  size = 'md',
  invalid = false,
  ...initialProps
}: StateProps) {
  return create<State>((set, get) => ({
    ...defaultState,
    ...initialProps,

    size,
    invalid,

    setToolbarElement: (element) => set({ toolbarElement: element }),
    setEditorElement: (element) => set({ editorElement: element }),

    initQuill: () => {
      const { toolbarElement, editorElement, readOnly, formats, placeholder, onMount } =
        get();
      if (!toolbarElement || !editorElement) return;

      const quill = new Quill(editorElement, {
        modules: {
          toolbar: {
            container: toolbarElement,
            handlers: {
              link: () => {},
            },
          },
        },
        readOnly,
        formats,
        placeholder,
      });
      quill.on(
        Quill.events.TEXT_CHANGE,
        (newContent: Delta, oldContent: Delta, _source: string) => {
          if (!quill) return;

          const { onChange } = get();

          if (!onChange || isEqual(newContent.ops, oldContent.ops)) return;

          onChange(newContent);
        },
      );
      set({ quill });
      onMount?.(quill);
    },
    setReadOnly: (readOnly) => {
      set({ readOnly });

      const { quill } = get();

      quill?.[readOnly ? 'disable' : 'enable']();
    },
    setPlaceholder: (placeholder) => {
      set({ placeholder });

      const { quill } = get();

      quill?.root.setAttribute('data-placeholder', placeholder);
    },
  }));
}
