import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';

import CardBody from './components/CardBody';
import CardFooter from './components/CardFooter';
import CardHeader from './components/CardHeader';

import cn from 'utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'flex',
        'flex-col',
        'w-full',
        'bg-background',
        'border',
        'border-outline',
        'rounded-md',
        className,
      )}
    />
  );
});
Card.displayName = 'Card';

export default Object.assign(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
