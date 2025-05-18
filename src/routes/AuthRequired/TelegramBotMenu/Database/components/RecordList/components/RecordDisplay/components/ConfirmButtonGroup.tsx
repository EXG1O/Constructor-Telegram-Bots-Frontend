import React, { memo, ReactElement } from 'react';

import Button from 'components/ui/Button';
import ButtonGroup, { ButtonGroupProps } from 'components/ButtonGroup';

import CheckIcon from 'assets/icons/check.svg';
import XIcon from 'assets/icons/x.svg';

export interface ConfirmButtonGroupProps extends Omit<ButtonGroupProps, 'children'> {
  onConfirm?: () => void;
  onCancel?: () => void;
}

const buttonClassName: string = 'd-flex p-0';

function ConfirmButtonGroup({
  onConfirm,
  onCancel,
  ...props
}: ConfirmButtonGroupProps): ReactElement<ConfirmButtonGroupProps> {
  return (
    <ButtonGroup size='sm' {...props}>
      <Button variant='success' className={buttonClassName} onClick={onConfirm}>
        <CheckIcon width={25} height={25} />
      </Button>
      <Button variant='danger' className={buttonClassName} onClick={onCancel}>
        <XIcon width={25} height={25} />
      </Button>
    </ButtonGroup>
  );
}

export default memo(ConfirmButtonGroup);
