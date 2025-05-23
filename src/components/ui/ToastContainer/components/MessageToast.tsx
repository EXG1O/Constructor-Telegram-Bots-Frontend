import React, { FC, ReactElement, SVGProps, useEffect, useRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { AnimationLifecycles, HTMLMotionProps, motion, Variants } from 'framer-motion';

import SuccessIcon from 'assets/icons/check-circle-fill.svg';
import ErrorIcon from 'assets/icons/exclamation-triangle-fill.svg';
import InfoIcon from 'assets/icons/info-circle-fill.svg';

import cn from 'utils/cn';

import { useToastContainerStore } from '../store';

export const messageToastVariants = cva(
  ['flex', 'w-90', 'items-center', 'text-sm', 'rounded-md', 'gap-3', 'p-3'],
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
  extends Omit<
      HTMLMotionProps<'div'>,
      'id' | 'initial' | 'animate' | 'exit' | 'children'
    >,
    AnimationLifecycles,
    Omit<VariantProps<typeof messageToastVariants>, 'show'> {
  id: string;
  timeout?: number;
  message: string;
  onShow?: () => void;
  onClose?: () => void;
}

const animationVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

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
  ...props
}: MessageToastProps): ReactElement {
  level ??= 'info';

  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    handleShow();
    return clearTimer;
  }, []);

  function clearTimer(): void {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }

  function handleShow(): void {
    onShow?.();
    timeoutId.current = setTimeout(handleClose, timeout);
  }

  function handleClose(): void {
    onClose?.();
    clearTimer();
    useToastContainerStore.setState((state) => {
      state.toasts = state.toasts.filter((toast) => toast.props.id !== id);
    });
  }

  const Icon: FC<SVGProps<SVGSVGElement>> = iconMap[level];

  return (
    <motion.div
      {...props}
      variants={animationVariants}
      initial='hidden'
      animate='visible'
      exit='hidden'
      className={cn(messageToastVariants({ level, className }))}
    >
      <Icon className='size-4' />
      <strong className='flex-auto wrap-break-word [word-break:break-word]'>
        {message}
      </strong>
      {/* FIXME: Need to add a close button. */}
    </motion.div>
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
