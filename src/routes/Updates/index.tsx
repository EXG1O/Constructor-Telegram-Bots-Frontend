import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/ui/Page';
import Pagination from 'components/ui/Pagination';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import UpdateItem from './components/UpdateItem';

import useUpdatesRouteLoaderData from './hooks/useUpdatesRouteLoaderData';

import { UpdatesAPI } from 'api/updates';

import { PaginationData } from './loader';

function Updates(): ReactElement {
  const { t, i18n } = useTranslation(RouteID.Updates);

  const { paginationData: initialPaginationData } = useUpdatesRouteLoaderData();

  const title: string = t('title');

  const [paginationData, setPaginationData] =
    useState<PaginationData>(initialPaginationData);
  const [loading, setLoading] = useState<boolean>(false);

  const isInitialRenderRef = useRef<boolean>(true);

  async function updateUpdates(
    limit: number = paginationData.limit,
    offset: number = paginationData.offset,
  ): Promise<void> {
    setLoading(true);

    const response = await UpdatesAPI.get(limit, offset);

    if (response.ok) {
      setPaginationData({ ...response.json, limit, offset });
    } else {
      createMessageToast({
        message: t('messages.getUpdates.error'),
        level: 'error',
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    updateUpdates();
  }, [i18n.language]);

  function handlePageChange(newItemOffset: number): void {
    updateUpdates(undefined, newItemOffset);
  }

  return (
    <Page title={title} flex gutters className='flex-auto'>
      <h2 className='text-center text-4xl font-semibold text-foreground'>{title}</h2>
      {!loading ? (
        paginationData.results.map((update) => (
          <UpdateItem key={update.id} update={update} />
        ))
      ) : (
        <div className='flex flex-auto items-center justify-center'>
          <Spinner />
        </div>
      )}
      <div className='flex w-full justify-center'>
        <Pagination
          itemCount={paginationData.count}
          itemLimit={paginationData.limit}
          itemOffset={paginationData.offset}
          onPageChange={handlePageChange}
        />
      </div>
    </Page>
  );
}

export default Updates;
