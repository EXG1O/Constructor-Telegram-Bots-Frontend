import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

import { Type } from '../../KeyboardTypeButtonGroup';

import { useCommandOffcanvasStore } from '../../../../../store';

export type URLInputCollapseProps = Pick<CollapseProps, 'children'>;

function URLInputCollapse({
  children,
  ...props
}: URLInputCollapseProps): ReactElement<URLInputCollapseProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock.urlInputCollapse',
  });

  const [{ value: type }] = useField<Type>(`keyboard.type`);

  const show = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.showURLInput,
  );
  const setShow = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.setShowURLInput,
  );

  const showButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'dark',
      className: 'w-100 mt-2',
      children: t('showButton'),
    }),
    [i18n.language],
  );
  const hideButtonProps = useMemo<ButtonProps>(
    () => ({
      variant: 'secondary',
      className: 'w-100 border-bottom-0 rounded rounded-bottom-0 mt-2',
      children: t('hideButton'),
    }),
    [i18n.language],
  );

  return (
    <div>
      <Collapse in={type !== 'default'}>
        <div>
          <Button
            size='sm'
            {...(show ? hideButtonProps : showButtonProps)}
            onClick={() => setShow(!show)}
          />
          <Collapse {...props} in={show}>
            <div>{children}</div>
          </Collapse>
        </div>
      </Collapse>
    </div>
  );
}

export default memo(URLInputCollapse);
