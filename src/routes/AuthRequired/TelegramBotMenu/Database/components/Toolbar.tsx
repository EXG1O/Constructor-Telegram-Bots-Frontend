import React, {
	HTMLAttributes,
	memo,
	ReactElement,
	useCallback,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Row } from 'react-bootstrap';

import { RouteID } from 'routes';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import RecordAdditionModal from './RecordAdditionModal';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

export interface ToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
		keyPrefix: 'records.toolbar',
	});

	const itemCount = useDatabaseRecordsStore((state) => state.count);
	const itemLimit = useDatabaseRecordsStore((state) => state.limit);
	const itemOffset = useDatabaseRecordsStore((state) => state.offset);
	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<RecordAdditionModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<Row {...props} lg='auto' className={classNames('g-2', className)}>
				<div>
					<AddButton
						size='sm'
						variant='dark'
						className='w-100'
						onClick={useCallback(() => setShowModal(true), [])}
					>
						{t('addRecordButton')}
					</AddButton>
				</div>
				<Search
					size='sm'
					className='flex-fill'
					onSearch={useCallback(
						(search) => updateRecords(undefined, undefined, search),
						[],
					)}
					onClear={useCallback(
						() => updateRecords(undefined, undefined, searchDefaultValue),
						[],
					)}
				/>
				<Pagination
					size='sm'
					itemCount={itemCount}
					itemLimit={itemLimit}
					itemOffset={itemOffset}
					className='justify-content-center ps-1'
					onPageChange={useCallback(
						(newOffset) => updateRecords(undefined, newOffset),
						[],
					)}
				/>
			</Row>
		</>
	);
}

export default memo(Toolbar);
