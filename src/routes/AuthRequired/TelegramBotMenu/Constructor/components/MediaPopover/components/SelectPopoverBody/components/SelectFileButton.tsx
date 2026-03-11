import React, {
  type InputHTMLAttributes,
  type ReactElement,
  useContext,
  useId,
} from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';

import SetOpenContext from '../../../contexts/SetOpenContext';

import { useMediaPopoverStore } from '../../../store';

export interface SelectFileButtonProps
  extends
    Omit<ButtonProps, 'size' | 'variant' | 'children'>,
    Pick<InputHTMLAttributes<HTMLInputElement>, 'accept' | 'multiple'> {}

function SelectFileButton({
  accept,
  multiple,
  ...props
}: SelectFileButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'mediaPopover.selectPopoverBody.selectFileButton',
  });

  const onAdd = useMediaPopoverStore((state) => state.onAdd);

  const setOpen = useContext(SetOpenContext)!;

  const inputID = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;
    event.target.value = '';
    if (!files || !files.length) return;

    onAdd?.({ url: null, files: Array.from(files) });
    setOpen(false);
  }

  return (
    <>
      <input
        id={inputID}
        type='file'
        accept={accept}
        multiple={multiple}
        hidden
        onChange={handleChange}
      />
      <Button {...props} asChild size='sm' variant='dark'>
        <label htmlFor={inputID}>
          {t('text', { context: multiple && 'multiple' })}
        </label>
      </Button>
    </>
  );
}

export default SelectFileButton;
