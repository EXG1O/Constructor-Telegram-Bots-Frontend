import React, { forwardRef } from 'react';
import {
  Bold,
  Code,
  CodeXml,
  Eraser,
  Italic,
  type LucideIcon,
  Quote,
  Strikethrough,
  Underline,
} from 'lucide-react';

import IconButton, { type IconButtonProps } from 'components/ui/IconButton';

import cn from 'utils/cn';

import type { Size } from '../../..';
import { useRichInputStore } from '../../../store';

const SIZE_MAP: Record<Size, NonNullable<IconButtonProps['size']>> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const ICON_MAP: Record<string, LucideIcon> = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  strike: Strikethrough,
  code: Code,
  'code-block': CodeXml,
  blockquote: Quote,
  clean: Eraser,
};

export interface ToolbarButtonProps extends Omit<IconButtonProps, 'size'> {
  format: string;
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ format, className, children, ...props }, ref) => {
    const Icon: LucideIcon | undefined = ICON_MAP[format];

    const size = useRichInputStore((state) => state.size);

    return (
      <IconButton
        {...props}
        ref={ref}
        size={SIZE_MAP[size]}
        className={cn(
          `ql-${format}`,
          'text-foreground',
          '[.ql-active]:text-primary',
          'hover:text-primary-accent!',
          'focus-visible:text-primary-accent!',
          className,
        )}
      >
        {Icon && <Icon />}
        {children}
      </IconButton>
    );
  },
);
ToolbarButton.displayName = 'ToolbarButton';

export default ToolbarButton;
