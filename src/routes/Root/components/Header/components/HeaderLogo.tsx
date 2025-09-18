import React, { HTMLAttributes, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { RouteID } from 'routes';

import IconButton from 'components/ui/IconButton';

import Logo from 'assets/logo/logo.svg';

import cn from 'utils/cn';
import reverse from 'utils/reverse';

export interface HeaderLogoProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function HeaderLogo({ className, ...props }: HeaderLogoProps): ReactElement {
  return (
    <div
      {...props}
      className={cn('flex', 'grow-0', 'items-center', 'xl:col-span-1', className)}
    >
      <IconButton asChild size={null}>
        <Link to={reverse(RouteID.Home)} className='rounded-full'>
          <Logo className='size-9.5' />
        </Link>
      </IconButton>
    </div>
  );
}

export default HeaderLogo;
