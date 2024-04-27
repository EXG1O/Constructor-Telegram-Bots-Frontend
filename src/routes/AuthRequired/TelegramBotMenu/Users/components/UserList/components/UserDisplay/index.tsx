import React, { ReactElement, HTMLAttributes, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import AllowButton from './components/AllowButton';
import DisallowButton from './components/DisallowButton';
import BlockButton from './components/BlockButton';
import UnblockButton from './components/UnblockButton';
import DeleteButton from './components/DeleteButton';

import useUser from '../../hooks/useUser';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

export type UserDisplayProps = Omit<HTMLAttributes<HTMLTableRowElement>, 'children'>;

function UserDisplay(props: UserDisplayProps): ReactElement<UserDisplayProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { user } = useUser();

	return (
		<tr {...props}>
			<td className='text-success-emphasis'>{`[${user.activated_date}]`}</td>
			<td className='text-primary-emphasis'>{user.telegram_id}</td>
			<td className='w-100'>{user.full_name}</td>
			<td>
				<div className='d-flex'>
					<div className='d-flex gap-2'>
						{telegramBot.is_private && (
							user.is_allowed ? (
								<DisallowButton />
							) : (
								<AllowButton />
							)
						)}
						{user.is_blocked ? (
							<UnblockButton />
						) : (
							<BlockButton />
						)}
					</div>
					<DeleteButton style={{ marginLeft: '5.5px' }} />
				</div>
			</td>
		</tr>
	);
}

export default memo(UserDisplay);