import React, { type ReactElement, useEffect } from 'react';
import type { FastFieldProps, FormikProps } from 'formik';

import Collapsible, { type CollapsibleProps } from 'components/ui/Collapsible';

import useFormToggleSectionStore from '../hooks/useTelegramBotContentStore';

export interface InnerProps
  extends FastFieldProps, Omit<CollapsibleProps, 'open' | 'onOpenChange'> {
  advanced?: boolean;
  onOpenChange?: (form: FormikProps<any>, open: boolean) => void;
}

function Inner({
  advanced,
  field,
  form,
  children,
  onOpenChange,
  ...props
}: InnerProps): ReactElement {
  const store = useFormToggleSectionStore();
  const getOpen = useFormToggleSectionStore((state) => state.getOpen);
  const setOpen = useFormToggleSectionStore((state) => state.setOpen);

  const open: boolean = getOpen ? getOpen(field, form) : Boolean(field.value);

  useEffect(() => {
    if (open === store.getState().open) return;
    onOpenChange?.(form, open);
    setOpen(open);
  }, [open]);

  function handleOpenChange(nextOpen: boolean): void {
    onOpenChange?.(form, nextOpen);
    form.setFieldValue(field.name, nextOpen);
    setOpen(nextOpen);
  }

  return (
    <Collapsible {...props} open={open} onOpenChange={handleOpenChange}>
      {advanced ? children : <Collapsible.Body>{children}</Collapsible.Body>}
    </Collapsible>
  );
}

export default Inner;
