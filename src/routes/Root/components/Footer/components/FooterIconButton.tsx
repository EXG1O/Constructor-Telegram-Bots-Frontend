import React, { type ReactElement } from 'react';

import IconButton, { type IconButtonProps } from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface FooterIconButtonProps extends Omit<IconButtonProps, 'size'> {}

function FooterIconButton({
  className,
  ...props
}: FooterIconButtonProps): ReactElement {
  return (
    <IconButton {...props} size='sm' className={cn('text-foreground', className)} />
  );
}

export default FooterIconButton;
