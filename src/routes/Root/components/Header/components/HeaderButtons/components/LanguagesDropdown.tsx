import React, { memo, type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMatches, useNavigate } from 'react-router-dom';
import Language from 'enums/language';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Dropdown, { type DropdownProps } from 'components/ui/Dropdown';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import reverse from 'utils/reverse';

export interface LanguagesDropdownProps extends Omit<DropdownProps, 'children'> {}

function LanguagesDropdown(props: LanguagesDropdownProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Root, {
    keyPrefix: 'header.languagesDropdown',
  });

  const navigate = useNavigate();
  const routeMatches = useMatches();

  const [loading, setLoading] = useState<boolean>(false);

  function changeLanguage(lang: Language): void {
    setLoading(true);
    i18n.changeLanguage(lang, (error) => {
      if (error) {
        createMessageToast({
          message: t('messages.changeLanguage.error'),
          level: 'error',
        });
      } else {
        const route = routeMatches[routeMatches.length - 1];
        navigate(reverse(route.id, { params: { ...route.params, lang } }));
      }
      setLoading(false);
    });
  }

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button disabled={loading} variant='primary'>
          {!loading ? i18n.language.toUpperCase() : <Spinner size='xs' />}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {Object.values(Language).map((lang) => (
          <Dropdown.Menu.Item key={lang} onSelect={() => changeLanguage(lang)}>
            {t(lang)}
          </Dropdown.Menu.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default memo(LanguagesDropdown);
