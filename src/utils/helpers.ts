import { ReactNode } from 'react';

type CustomOmit<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
type ReplaceProps<Inner extends React.ElementType, P> = CustomOmit<
  React.ComponentPropsWithRef<Inner>,
  P
> &
  P;

export interface AsProp<As extends React.ElementType = React.ElementType> {
  as?: As;
}

export type FCA<TInitial extends React.ElementType, P = unknown> = <
  As extends React.ElementType = TInitial,
>(
  props: React.PropsWithChildren<ReplaceProps<As, AsProp<As> & P>>,
  context?: any,
) => ReactNode;
