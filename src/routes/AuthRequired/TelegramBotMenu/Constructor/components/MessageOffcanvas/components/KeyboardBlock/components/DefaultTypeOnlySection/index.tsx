import React, { type HTMLAttributes, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import ToolbarVariablesButton from 'components/shared/TelegramSimpleInputLayout/components/ToolbarVariablesButton';
import SimpleInput from 'components/ui/SimpleInput';

import InputPlaceholderToggleButtonInner from './components/InputPlaceholderToggleButtonInner';

import FormToggleSection from '../../../../../FormToggleSection';
import { Type } from '../KeyboardTypeTabs/enums';

import cn from 'utils/cn';

export interface DefaultTypeOnlySectionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function DefaultTypeOnlySection({
  className,
  ...props
}: DefaultTypeOnlySectionProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas.keyboardBlock.defaultTypeOnlySection' },
  );

  return (
    <FormToggleSection
      name='keyboard.type'
      getOpen={(field) => field.value === Type.Default}
      className='w-full'
    >
      <div {...props} className={cn('w-full', 'flex', 'flex-col', 'gap-2', className)}>
        <div className='flex w-full flex-col gap-1'>
          <FormCheckFeedback
            type='switch'
            size='sm'
            name='keyboard.default_type_only.settings.is_compact'
            label={t('settings.compactSwitch.label')}
          />
          <FormCheckFeedback
            type='switch'
            size='sm'
            name='keyboard.default_type_only.settings.hide_on_click'
            label={t('settings.hideOnClickSwitch.label')}
          />
          <FormCheckFeedback
            type='switch'
            size='sm'
            name='keyboard.default_type_only.settings.is_persistent'
            label={t('settings.persistentSwitch.label')}
          />
        </div>
        <FormToggleSection
          advanced
          name='keyboard.default_type_only.show_input_placeholder'
          className='w-full'
        >
          <FormToggleSection.TriggerButton
            size='sm'
            className='gap-0.75'
            openProps={{
              children: (
                <InputPlaceholderToggleButtonInner
                  text={t('inputPlaceholder.hideButton.text')}
                />
              ),
            }}
            closedProps={{
              children: (
                <InputPlaceholderToggleButtonInner
                  text={t('inputPlaceholder.showButton.text')}
                />
              ),
            }}
          />
          <FormToggleSection.Body>
            <FormSimpleInputFeedback
              size='sm'
              name='keyboard.default_type_only.input_placeholder'
              placeholder={t('inputPlaceholder.input.placeholder')}
            >
              <SimpleInput.Container className='rounded-t-none border-t-0'>
                <SimpleInput.Toolbar className='justify-end'>
                  <ToolbarVariablesButton />
                </SimpleInput.Toolbar>
                <SimpleInput.Editor />
              </SimpleInput.Container>
            </FormSimpleInputFeedback>
          </FormToggleSection.Body>
        </FormToggleSection>
      </div>
    </FormToggleSection>
  );
}

export default DefaultTypeOnlySection;
