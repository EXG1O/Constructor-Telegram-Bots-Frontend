import React, { memo, ReactElement } from 'react';

import Container from 'components/ui/Container';
import IconButton from 'components/ui/IconButton';

import Github from 'assets/icons/github.svg';
import Telegram from 'assets/icons/telegram.svg';

function Footer(): ReactElement {
  return (
    <Container asChild>
      <footer className='flex justify-between py-2 text-foreground'>
        <span>&copy; 2025 exg1o</span>
        <div className='flex gap-1'>
          <IconButton asChild size='sm'>
            <a href='https://t.me/exg1o_channel' target='_blank' rel='noreferrer'>
              <Telegram />
            </a>
          </IconButton>
          <IconButton asChild size='sm'>
            <a
              href='https://github.com/EXG1O/Constructor-Telegram-Bots'
              target='_blank'
              rel='noreferrer'
            >
              <Github />
            </a>
          </IconButton>
        </div>
      </footer>
    </Container>
  );
}

export default memo(Footer);
