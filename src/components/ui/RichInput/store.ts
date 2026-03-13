import Quill from 'quill';
import { create } from 'zustand';

import { DEFAULT_FORMATS, DEFAULT_SIZE, type Size } from '.';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData {
  toolbarElement: HTMLDivElement | null;
  editorElement: HTMLDivElement | null;

  height?: string;
  size: Size;
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
  setToolbarElement: (toolbarElement: StateData['toolbarElement']) => void;
  setEditorElement: (editorElement: StateData['editorElement']) => void;

  initQuill: () => void;
  setReadOnly: (readOnly: NonNullable<StateData['readOnly']>) => void;
  setValue: (value: NonNullable<StateData['value']>) => void;
  setPlaceholder: (placeholder: NonNullable<StateData['placeholder']>) => void;
}

export type State = BaseState<StateProps> & StateData & StateActions;
export type StateProps = Partial<
  Omit<StateData, 'toolbarElement' | 'editorElement' | 'quill'>
>;

function getData({
  size = DEFAULT_SIZE,
  invalid = false,
  formats = DEFAULT_FORMATS,
  ...rest
}: StateProps): Omit<StateData, 'toolbarElement' | 'editorElement' | 'quill'> {
  return { ...rest, size, invalid, formats };
}

export const [RichInputStoreProvider, useRichInputStore] = createZustandContext(
  (props: StateProps) =>
    create<State>((set, get) => ({
      ...getData(props),

      toolbarElement: null,
      editorElement: null,
      quill: null,

      syncFromProps: ({ readOnly, value, placeholder, ...props }) => {
        set(getData(props));

        const { quill, setReadOnly, setValue, setPlaceholder } = get();

        if (readOnly !== undefined) {
          setReadOnly(readOnly);
        }
        if (value !== undefined && value !== quill?.getSemanticHTML()) {
          setValue(value);
        }
        if (placeholder !== undefined) {
          setPlaceholder(placeholder);
        }
      },

      setToolbarElement: (toolbarElement) => set({ toolbarElement }),
      setEditorElement: (editorElement) => set({ editorElement }),

      initQuill: () => {
        const {
          toolbarElement,
          editorElement,
          readOnly,
          formats,
          value,
          placeholder,
          onMount,
          setValue,
        } = get();
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

        if (value) {
          setValue(value);
        }

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
    })),
);
