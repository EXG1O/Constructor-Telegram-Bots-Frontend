import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

export type DescriptionInputCollapseProps = Omit<CollapseProps, 'in'>;

function DescriptionInputCollapse({
  children,
  ...props
}: DescriptionInputCollapseProps): ReactElement<DescriptionInputCollapseProps> {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.triggerBlock.descriptionInputCollapse',
  });

  const [{ value: show }, _meta, { setValue }] = useField<boolean>(
    'show_trigger_description_input',
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
      <Button
        size='sm'
        {...(show ? hideButtonProps : showButtonProps)}
        onClick={() => setValue(!show)}
      />
      <Collapse {...props} in={show}>
        <div>{children}</div>
      </Collapse>
    </div>
  );
}

export default memo(DescriptionInputCollapse);
