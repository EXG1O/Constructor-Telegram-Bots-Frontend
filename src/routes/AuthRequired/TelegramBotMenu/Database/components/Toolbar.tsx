import React, {
  HTMLAttributes,
  memo,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Row } from 'react-bootstrap';

import { RouteID } from 'routes';

import PlusButton from 'components/ui/PlusButton';
import Pagination, { PaginationProps } from 'components/Pagination';
import Search, { SearchProps } from 'components/Search';

import RecordAdditionModal, { RecordAdditionModalProps } from './RecordAdditionModal';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

export interface ToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

type HideHandler = RecordAdditionModalProps['onHide'];
type AddButtonClickHandler = MouseEventHandler<HTMLButtonElement>;
type SearchHandler = SearchProps['onSearch'];
type ClearHandler = SearchProps['onClear'];
type PageChangeHandler = PaginationProps['onPageChange'];

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.toolbar',
  });

  const itemCount = useDatabaseRecordsStore((state) => state.count);
  const itemLimit = useDatabaseRecordsStore((state) => state.limit);
  const itemOffset = useDatabaseRecordsStore((state) => state.offset);
  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleHide = useCallback<HideHandler>(() => setShowModal(false), []);
  const handleAddButtonClick = useCallback<AddButtonClickHandler>(
    () => setShowModal(true),
    [],
  );
  const handleSearch = useCallback<SearchHandler>(
    (value) => updateRecords(undefined, undefined, value),
    [],
  );
  const handleClear = useCallback<ClearHandler>(
    () => updateRecords(undefined, undefined, null),
    [],
  );
  const handlePageChange = useCallback<PageChangeHandler>(
    (newOffset) => updateRecords(undefined, newOffset),
    [],
  );

  return (
    <>
      <RecordAdditionModal show={showModal} onHide={handleHide} />
      <Row {...props} lg='auto' className={classNames('g-2', className)}>
        <div>
          <PlusButton
            size='sm'
            variant='dark'
            className='w-100'
            onClick={handleAddButtonClick}
          >
            {t('addRecordButton')}
          </PlusButton>
        </div>
        <Search
          size='sm'
          className='flex-fill'
          onSearch={handleSearch}
          onClear={handleClear}
        />
        <Pagination
          size='sm'
          itemCount={itemCount}
          itemLimit={itemLimit}
          itemOffset={itemOffset}
          className='justify-content-center ps-1'
          onPageChange={handlePageChange}
        />
      </Row>
    </>
  );
}

export default memo(Toolbar);
