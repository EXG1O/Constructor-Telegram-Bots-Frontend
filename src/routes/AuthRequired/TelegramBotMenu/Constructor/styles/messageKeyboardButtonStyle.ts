import { cva } from 'class-variance-authority';

export const messageKeyboardButtonStyleVariants = cva([], {
  variants: {
    style: {
      default: ['bg-dark', 'text-dark-foreground'],
      primary: ['bg-primary', 'text-primary-foreground'],
      success: ['bg-success', 'text-success-foreground'],
      danger: ['bg-danger', 'text-danger-foreground'],
    },
  },
  defaultVariants: {
    style: 'default',
  },
});
