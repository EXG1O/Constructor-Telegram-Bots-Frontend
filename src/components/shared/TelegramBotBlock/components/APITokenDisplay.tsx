import React, { HTMLAttributes, ReactElement, useMemo, useState } from 'react';
import { Eye, EyeOff, SquarePen } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import useTelegramBot from '../hooks/useTelegramBot';

import cn from 'utils/cn';

export interface APITokenDisplayProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  onEdit: () => void;
}

function APITokenDisplay({
  className,
  onEdit,
  ...props
}: APITokenDisplayProps): ReactElement<APITokenDisplayProps> {
  const [telegramBot] = useTelegramBot();

  const [show, setShow] = useState<boolean>(false);

  const hiddenAPIToken = useMemo<string>(() => {
    const [id, token] = telegramBot.api_token.split(':');
    return id + ':' + '*'.repeat(token.length);
  }, [telegramBot.api_token]);

  function handleEditClick(): void {
    onEdit();
  }

  function handleShowClick(): void {
    setShow(!show);
  }

  const ShowIcon = show ? EyeOff : Eye;

  return (
    <div {...props} className={cn('flex', 'items-center', 'gap-2', className)}>
      <span className='flex-auto'>{show ? telegramBot.api_token : hiddenAPIToken}</span>
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
