import React, { ReactElement } from 'react';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import { useMessageOffcanvasStore } from '../../../../../store';

export interface ToggleSectionProps extends Omit<CollapsibleProps, 'open'> {}

function ToggleSection({ children, ...props }: ToggleSectionProps): ReactElement {
  const show = useMessageOffcanvasStore((state) => state.keyboardButtonBlock.show);

  return (
    <Collapsible {...props} open={show}>
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default ToggleSection;
