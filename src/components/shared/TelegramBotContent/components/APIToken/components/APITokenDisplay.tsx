import React, { HTMLAttributes, ReactElement, useMemo, useState } from 'react';
import { Eye, EyeOff, SquarePen } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import useTelegramBotContentStore from '../../../hooks/useTelegramBotContentStore';

import cn from 'utils/cn';

export interface APITokenDisplayProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function APITokenDisplay({ className, ...props }: APITokenDisplayProps): ReactElement {
  const telegramBot = useTelegramBotContentStore((state) => state.telegramBot);
  const toggleAPITokenState = useTelegramBotContentStore(
    (state) => state.toggleAPITokenState,
  );

  const [show, setShow] = useState<boolean>(false);

  const hiddenAPIToken = useMemo<string>(() => {
    const [id, token] = telegramBot.api_token.split(':');
    return id + ':' + '*'.repeat(token.length);
  }, [telegramBot.api_token]);

  function handleEditClick(): void {
    toggleAPITokenState();
  }

  function handleShowClick(): void {
    setShow(!show);
  }

  const ShowIcon = show ? EyeOff : Eye;

  return (
    <div
      {...props}
      className={cn('flex', 'items-center', 'w-full', 'gap-2', className)}
    >
      <span className='flex-auto wrap-break-word break-word'>
        {show ? telegramBot.api_token : hiddenAPIToken}
      </span>
      <div className='flex gap-1'>
        <IconButton onClick={handleEditClick}>
          <SquarePen />
        </IconButton>
        <IconButton onClick={handleShowClick}>
          <ShowIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default APITokenDisplay;
