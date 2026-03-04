import React, { type ReactElement, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useTelegramBotStore } from './store';

function Root(): ReactElement {
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  useEffect(() => {
    return () => {
      setTelegramBot(null);
    };
  }, []);

  return <Outlet />;
}

export default Root;
