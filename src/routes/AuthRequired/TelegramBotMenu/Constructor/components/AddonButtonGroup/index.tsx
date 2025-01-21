import React, { HTMLAttributes, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Collapse from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';
import Stack from 'components/Stack';

import AddonButton from './components/AddonButton';

export type AddonButtonGroupProps = HTMLAttributes<HTMLDivElement>;

function AddonButtonGroup({
  children,
  ...props
}: AddonButtonGroupProps): ReactElement<AddonButtonGroupProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'addonButtonGroup',
  });

  const [show, setShow] = useState<boolean>(false);

  const showButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'dark',
      className: 'w-100',
      children: t('showButton'),
    }),
    [i18n.language],
  );
  const hideButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'secondary',
      className: 'w-100 border-bottom-0 rounded-bottom-0',
      children: t('hideButton'),
    }),
    [i18n.language],
  );

  return (
    <div {...props}>
      <Button
        size='sm'
        {...(show ? hideButtonProps : showButtonProps)}
        onClick={() => setShow(!show)}
      />
      <Collapse in={show}>
        <div>
          <Stack
            gap={1}
            className='bg-light border border-top-0 rounded-1 rounded-top-0 p-1'
          >
            {children}
          </Stack>
        </div>
      </Collapse>
    </div>
  );
}

export default Object.assign(AddonButtonGroup, { Button: AddonButton });
