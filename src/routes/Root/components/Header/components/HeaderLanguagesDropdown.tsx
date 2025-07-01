import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useLanguagesRouteLoaderData from 'routes/Languages/hooks/useLanguagesRouteLoaderData';

import Button from 'components/ui/Button';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { LanguagesAPI } from 'api/languages/main';

export interface HeaderLanguagesDropdownProps extends Omit<DropdownProps, 'children'> {}

function HeaderLanguagesDropdown(props: HeaderLanguagesDropdownProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.languagesDropdown',
  });

  const { languages } = useLanguagesRouteLoaderData();

  async function setLanguage(langCode: string): Promise<void> {
    const response = await LanguagesAPI.set({ lang_code: langCode });

    if (response.ok) {
      await i18n.changeLanguage(langCode);
    } else {
      createMessageToast({
        message: t('messages.changeLanguage.error'),
        level: 'error',
      });
    }
  }

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button variant='primary'>{i18n.language.toUpperCase()}</Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {Object.entries(languages).map((language, index) => (
          <Dropdown.Menu.Item key={index} onSelect={() => setLanguage(language[0])}>
            {language[1]}
          </Dropdown.Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default HeaderLanguagesDropdown;
