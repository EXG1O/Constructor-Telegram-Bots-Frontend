import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';

import Spinner from 'components/ui/Spinner';

export type EditorLoadingProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function EditorLoading({
  className,
  ...props
}: EditorLoadingProps): ReactElement<EditorLoadingProps> {
  return (
    <div
      {...props}
      className={classNames('d-flex justify-content-center w-100 p-2', className)}
    >
      <Spinner size='sm' />
    </div>
  );
}

export default memo(EditorLoading);
