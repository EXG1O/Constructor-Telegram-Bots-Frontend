import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useLanguagesRouteLoaderData from 'routes/Languages/hooks/useLanguagesRouteLoaderData';

import Dropdown, { DropdownProps } from 'components/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { LanguagesAPI } from 'api/languages/main';

export type LanguagesDropdownProps = Omit<DropdownProps, 'children'>;

function LanguagesDropdown(
  props: LanguagesDropdownProps,
): ReactElement<LanguagesDropdownProps> {
  const { t, i18n } = useTranslation(RouteID.Root, {
    keyPrefix: 'languagesDropdown',
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
      <Dropdown.Toggle variant='primary'>{i18n.language.toUpperCase()}</Dropdown.Toggle>
      <Dropdown.Menu>
        {Object.entries(languages).map((language, index) => (
          <Dropdown.Item key={index} onClick={() => setLanguage(language[0])}>
            {language[1]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default memo(LanguagesDropdown);
