import React, { memo, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import { LanguagesAPI } from 'api/languages';

type Languages = Record<string, string>;

export interface LanguagesDropdownProps extends Omit<DropdownProps, 'children'> {}

function LanguagesDropdown(props: LanguagesDropdownProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.languagesDropdown',
  });

  const [languages, setLanguages] = useState<Languages | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function updateLanguages(): Promise<void> {
    setLoading(true);

    const response = await LanguagesAPI.get();

    if (!response.ok) {
      createMessageToast({
        message: t('messages.getLanguage.error'),
        level: 'error',
      });
      return;
    }

    setLanguages(response.json);
    setLoading(false);
  }

  useEffect(() => {
    updateLanguages();
  }, []);

  async function setLanguage(langCode: string): Promise<void> {
    const response = await LanguagesAPI.set({ lang_code: langCode });

    if (response.ok) {
      await Promise.all([updateLanguages(), i18n.changeLanguage(langCode)]);
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
        <Button disabled={loading} variant='primary'>
          {!loading ? i18n.language.toUpperCase() : <Spinner size='xs' />}
        </Button>
      </Dropdown.Trigger>
      {languages && (
        <Dropdown.Menu>
          {Object.entries(languages).map(([code, label]) => (
            <Dropdown.Menu.Item key={code} onSelect={() => setLanguage(code)}>
              {label}
            </Dropdown.Menu.Item>
          ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
}

export default memo(LanguagesDropdown);
