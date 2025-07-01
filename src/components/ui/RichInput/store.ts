import Quill from 'quill';
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
  value?: string;
  placeholder?: string;
  onMount?: (quill: Quill) => void;
  onChange?: (value: string) => void;
}

export interface StateActions {
  setToolbarElement: (element: HTMLDivElement | null) => void;
  setEditorElement: (element: HTMLDivElement | null) => void;

  initQuill: () => void;
  setReadOnly: (readOnly: boolean) => void;
  setValue: (value: string) => void;
  setPlaceholder: (placeholder: string) => void;
}

export type State = StateParams & StateActions;
export type StateProps = Partial<Pick<StateParams, 'size' | 'invalid'>> &
  Pick<
    StateParams,
    'height' | 'readOnly' | 'formats' | 'value' | 'placeholder' | 'onMount' | 'onChange'
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
      quill.on(Quill.events.TEXT_CHANGE, () => {
        const { value, onChange } = get();

        const nextValue: string = quill.getSemanticHTML();
        if (nextValue === value) return;

        set({ value: nextValue });
        onChange?.(nextValue);
      });
      set({ quill });
      onMount?.(quill);
    },
    setReadOnly: (readOnly) => {
      set({ readOnly });

      const { quill } = get();

      quill?.[readOnly ? 'disable' : 'enable']();
    },
    setValue: (value) => {
      set({ value });

      const { quill } = get();
      if (!quill) return;

      const selectionRange = quill.getSelection();

      quill.setContents(quill.clipboard.convert({ html: value }));
      quill.setSelection(selectionRange);
    },
    setPlaceholder: (placeholder) => {
      set({ placeholder });

      const { quill } = get();

      quill?.root.setAttribute('data-placeholder', placeholder);
    },
  }));
}
