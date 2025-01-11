import React, {
	memo,
	ReactElement,
	TdHTMLAttributes,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import i18n from 'i18n';
import formatDate from 'i18n/formatDate';

import Block, { BlockProps } from 'components/Block';
import Table from 'components/Table';
import TelegramBotStorage from 'components/TelegramBotStorage';
import { createMessageToast } from 'components/ToastContainer';

import APITokenDisplay from './components/APITokenDisplay';
import APITokenEditing from './components/APITokenEditing';
import PrivateSwitch from './components/PrivateSwitch';
import TelegramBotContext from './contexts/TelegramBotContext';

import { TelegramBotAPI } from 'api/telegram_bots/main';
import { TelegramBot } from 'api/telegram_bots/types';

export interface TelegramBotBlockProps
	extends Omit<BlockProps, 'variant' | 'gradient'> {
	telegramBot: TelegramBot;
}

function TelegramBotBlock({
	telegramBot: initialTelegramBot,
	className,
	children,
	...props
}: TelegramBotBlockProps): ReactElement<TelegramBotBlockProps> {
	const { t } = useTranslation('components', { keyPrefix: 'telegramBotBlock' });

	const [telegramBot, setTelegramBot] = useState<TelegramBot>(initialTelegramBot);
	const [apiTokenEditing, setAPITokenEditing] = useState<boolean>(false);

	useEffect(() => setTelegramBot(initialTelegramBot), [initialTelegramBot]);

	const toggleAPITokenState = useCallback(
		() => setAPITokenEditing(!apiTokenEditing),
		[apiTokenEditing],
	);

	useEffect(() => {
		const checkStatus = async () => {
			if (!telegramBot.is_loading) return;

			const response = await TelegramBotAPI.get(telegramBot.id);

			if (!response.ok || response.json.is_loading) {
				if (!response.ok) {
					createMessageToast({
						message: t('messages..getTelegramBot.error'),
						level: 'error',
					});
				}

				setTimeout(checkStatus, 3000);
				return;
			}

			setTelegramBot(response.json);
		};

		checkStatus();
	}, [telegramBot.is_loading]);

	const loadingStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
		() => ({
			className: 'text-secondary',
			children: t('table.status.loading'),
		}),
		[i18n.language],
	);
	const enabledStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
		() => ({
			className: 'text-success',
			children: t('table.status.enabled'),
		}),
		[i18n.language],
	);
	const disabledStatusProps = useMemo<TdHTMLAttributes<HTMLTableCellElement>>(
		() => ({
			className: 'text-danger',
			children: t('table.status.disabled'),
		}),
		[i18n.language],
	);

	return (
		<TelegramBotContext.Provider value={[telegramBot, setTelegramBot]}>
			<Block
				{...props}
				variant='light'
				className={classNames(className, 'd-flex flex-column gap-2')}
			>
				<h4 className='fw-semibold text-center'>
					<a
						className='text-reset text-decoration-none'
						href={`https://t.me/${telegramBot.username}`}
						rel='noreferrer'
						target='_blank'
					>
						{telegramBot.username}
					</a>
				</h4>
				<Table size='sm' borderless className='align-middle mb-0'>
					<tbody>
						<tr>
							<th scope='row'>{t('table.status.header')}:</th>
							<td
								{...(telegramBot.is_loading
									? loadingStatusProps
									: telegramBot.is_enabled
										? enabledStatusProps
										: disabledStatusProps)}
							/>
						</tr>
						<tr>
							<th scope='row'>{t('table.apiToken.header')}:</th>
							<td className='w-100'>
								{apiTokenEditing ? (
									<APITokenEditing
										onSaved={toggleAPITokenState}
										onCancel={toggleAPITokenState}
									/>
								) : (
									<APITokenDisplay onEdit={toggleAPITokenState} />
								)}
							</td>
						</tr>
						<tr>
							<th scope='row'>{t('table.private.header')}:</th>
							<td>
								<PrivateSwitch />
							</td>
						</tr>
						<tr>
							<th scope='row'>{t('table.storage.header')}:</th>
							<td>
								<TelegramBotStorage telegramBot={telegramBot} />
							</td>
						</tr>
						<tr>
							<th scope='row'>{t('table.addedDate.header')}:</th>
							<td>{formatDate(telegramBot.added_date)}</td>
						</tr>
					</tbody>
				</Table>
				{children}
			</Block>
		</TelegramBotContext.Provider>
	);
}

export default memo(TelegramBotBlock);
