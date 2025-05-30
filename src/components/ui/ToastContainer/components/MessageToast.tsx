import React, { FC, LiHTMLAttributes, ReactElement, SVGProps, useState } from 'react';
import { Toast, ToastClose, ToastDescription } from '@radix-ui/react-toast';
import { cva, VariantProps } from 'class-variance-authority';

import CloseButton from 'components/shared/CloseButton';

import SuccessIcon from 'assets/icons/check-circle-fill.svg';
import ErrorIcon from 'assets/icons/exclamation-triangle-fill.svg';
import InfoIcon from 'assets/icons/info-circle-fill.svg';

import cn from 'utils/cn';

import { useToastContainerStore } from '../store';

export const messageToastVariants = cva(
  [
    'flex',
    'w-auto',
    'max-w-[360px]',
    'items-center',
    'rounded-md',
    'gap-3',
    'p-3',
    'transition-transform',
    'data-[state=open]:animate-in',
    'data-[state=open]:slide-in-from-right',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-65',
    'data-[state=closed]:slide-out-to-right',
    'data-[swipe=end]:animate-out',
    'data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
    'data-[swipe=move]:transition-none',
    'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
    'data-[swipe=cancel]:translate-x-0',
  ],
  {
    variants: {
      level: {
        success: ['bg-success', 'text-success-foreground'],
        error: ['bg-danger', 'text-danger-foreground'],
        info: ['bg-info', 'text-info-foreground'],
      },
    },
    defaultVariants: {
      level: 'info',
    },
  },
);

export interface MessageToastProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'id' | 'children' | 'onPause'>,
    VariantProps<typeof messageToastVariants> {
  id: string;
  timeout?: number;
  message: string;
  onShow?: () => void;
  onClose?: () => void;
}

const iconMap: Record<
  NonNullable<MessageToastProps['level']>,
  FC<SVGProps<SVGSVGElement>>
> = {
  success: SuccessIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

function MessageToast({
  id,
  level,
  timeout = 6000,
  message,
  className,
  onShow,
  onClose,
  onAnimationEnd,
  ...props
}: MessageToastProps): ReactElement {
  level ??= 'info';

  const [show, setShow] = useState(true);

  function handleOpenChange(open: boolean): void {
    setShow(open);
    (open ? onShow : onClose)?.();
  }

  function handleAnimationEnd(event: React.AnimationEvent<HTMLLIElement>): void {
    onAnimationEnd?.(event);

    const state = event.currentTarget.dataset.state as 'open' | 'closed' | undefined;

    if (state === 'closed') {
      useToastContainerStore.setState((state) => {
        state.toasts = state.toasts.filter((toast) => toast.props.id !== id);
      });
    }
  }

  const Icon: FC<SVGProps<SVGSVGElement>> = iconMap[level];

  return (
    <Toast
      {...props}
      open={show}
      duration={timeout}
      className={cn(messageToastVariants({ level, className }))}
      onOpenChange={handleOpenChange}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon className='size-4' />
      <ToastDescription asChild>
        <strong className='flex-auto text-sm wrap-break-word [word-break:break-word]'>
          {message}
        </strong>
      </ToastDescription>
      <ToastClose asChild>
        <CloseButton />
      </ToastClose>
    </Toast>
  );
}

export function createMessageToast(props: Omit<MessageToastProps, 'id'>): string {
  const id: string = Math.random().toString(36).substring(2, 10);

  useToastContainerStore.setState(({ toasts }) => {
    toasts.push(<MessageToast key={id} id={id} {...props} />);
  });

  return id;
}

export default MessageToast;
