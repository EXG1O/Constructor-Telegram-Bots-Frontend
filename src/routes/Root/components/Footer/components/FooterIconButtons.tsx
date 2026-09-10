import React, { type HTMLAttributes, type ReactElement } from 'react';

import FooterIconButton from './FooterIconButton';

import Github from 'assets/icons/github.svg';
import Telegram from 'assets/icons/telegram.svg';
import YouTube from 'assets/icons/youtube.svg';

import cn from 'utils/cn';
export interface FooterIconButtonsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function FooterIconButtons({
  className,
  ...props
}: FooterIconButtonsProps): ReactElement {
  return (
    <div {...props} className={cn('w-full', 'flex', 'justify-end', 'gap-1', className)}>
      <FooterIconButton asChild>
        <a href='https://www.youtube.com/@exg11o' target='_blank' rel='noreferrer'>
          <YouTube />
        </a>
      </FooterIconButton>
      <FooterIconButton asChild>
        <a href='https://t.me/exg1o_channel' target='_blank' rel='noreferrer'>
          <Telegram />
        </a>
      </FooterIconButton>
      <FooterIconButton asChild>
        <a
          href='https://github.com/EXG1O/Constructor-Telegram-Bots'
          target='_blank'
          rel='noreferrer'
        >
          <Github />
        </a>
      </FooterIconButton>
    </div>
  );
}

export default FooterIconButtons;
