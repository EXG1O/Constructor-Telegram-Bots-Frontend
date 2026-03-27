import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';

import ActionButtonGroup from './components/ActionButtonGroup';
import RefreshTokensBlock from './components/RefreshTokensBlock';
import UserDataBlock from './components/UserDataBlock';

function Profile(): ReactElement {
  const { t } = useTranslation(RouteID.Profile);

  return (
    <Page title={t('title')} flex gutters className='flex-auto'>
      <UserDataBlock />
      <RefreshTokensBlock />
      <ActionButtonGroup />
    </Page>
  );
}

export default Profile;
