import React, { forwardRef } from 'react';
import { EyeOff } from 'lucide-react';

import ToolbarButton, {
  ToolbarButtonProps,
} from 'components/ui/RichInput/components/RichInputToolbar/components/ToolbarButton';

export interface ToolbarSpoilerButtonProps extends Omit<ToolbarButtonProps, 'format'> {}

const ToolbarSpoilerButton = forwardRef<HTMLButtonElement, ToolbarSpoilerButtonProps>(
  (props, ref) => {
    return (
      <ToolbarButton {...props} ref={ref} format='spoiler'>
        <EyeOff />
      </ToolbarButton>
    );
  },
);
ToolbarSpoilerButton.displayName = 'ToolbarSpoilerButton';

export default ToolbarSpoilerButton;
