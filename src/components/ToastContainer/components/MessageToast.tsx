import React, { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import Toast, { ToastProps } from 'react-bootstrap/Toast';

import CloseButton from 'components/CloseButton';

import SuccessIcon from 'assets/icons/check-circle-fill.svg';
import ErrorIcon from 'assets/icons/exclamation-triangle-fill.svg';
import InfoIcon from 'assets/icons/info-circle-fill.svg';

import { useToastContainerStore } from '../store';

type Level = 'success' | 'info' | 'error';

export interface MessageToastProps
  extends Omit<ToastProps, 'autohide' | 'show' | 'delay' | 'onClose' | 'children'> {
  message: string;
  level: Level;
}

const colors: Record<Level, string> = {
  success: 'success',
  info: 'primary',
  error: 'danger',
};
const icons: Record<Level, React.FC<React.SVGProps<SVGSVGElement>>> = {
  success: SuccessIcon,
  info: InfoIcon,
  error: ErrorIcon,
};

function MessageToast({
  id,
  message,
  level,
  className,
  onExited,
  ...props
}: MessageToastProps): ReactElement<MessageToastProps> {
  const [show, setShow] = useState<boolean>(false);

  const Icon = useMemo(() => icons[level], [level]);

  useEffect(() => setShow(true), []);

  function handleExited(node: HTMLElement): void {
    useToastContainerStore.setState((state) => {
      state.toasts = state.toasts.filter((toast) => toast.props.id !== id);
    });
    onExited?.(node);
  }

  return (
    <Toast
      {...props}
      autohide
      show={show}
      delay={6000}
      className={classNames(`text-bg-${colors[level]}`, className)}
      onClose={() => setShow(false)}
      onExited={handleExited}
    >
      <Toast.Body className='d-flex align-items-center gap-2'>
        <Icon />
        <strong className='flex-fill text-break'>{message}</strong>
        <CloseButton variant='white' onClick={() => setShow(false)} />
      </Toast.Body>
    </Toast>
  );
}

export function createMessageToast(props: MessageToastProps): void {
  const id: string = crypto.randomUUID();

  useToastContainerStore.setState((state) => {
    state.toasts.push(<MessageToast key={id} id={id} {...props} />);
  });
}

export default memo(MessageToast);
