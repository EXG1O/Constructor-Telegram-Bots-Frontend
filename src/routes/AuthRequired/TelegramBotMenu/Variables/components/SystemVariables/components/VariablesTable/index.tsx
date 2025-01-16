import React, { HTMLAttributes, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import Table from 'components/Table';

import TableRow from './components/TableRow';

import { Type } from '../..';

export interface VariablesTableProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	type: Type;
}

export interface Variable {
	name: string;
	description: string;
}

function VariablesTable({
	type,
	className,
	...props
}: VariablesTableProps): ReactElement<VariablesTableProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'system.variables',
	});

	const variables = useMemo<Record<Type, Variable[]>>(
		() => ({
			personal: [
				{ name: 'USER_ID', description: t('personal.userID') },
				{ name: 'USER_USERNAME', description: t('personal.userUsername') },
				{ name: 'USER_FIRST_NAME', description: t('personal.userFirstName') },
				{ name: 'USER_LAST_NAME', description: t('personal.userLastName') },
				{ name: 'USER_FULL_NAME', description: t('personal.userFullName') },
				{
					name: 'USER_LANGUAGE_CODE',
					description: t('personal.userLanguageCode'),
				},
				{ name: 'USER_MESSAGE_ID', description: t('personal.userMessageID') },
				{
					name: 'USER_MESSAGE_TEXT',
					description: t('personal.userMessageText'),
				},
				{
					name: 'USER_MESSAGE_DATE',
					description: t('personal.userMessageDate'),
				},
			],
			global: [
				{ name: 'BOT_NAME', description: t('global.botName') },
				{ name: 'BOT_USERNAME', description: t('global.botUsername') },
			],
		}),
		[i18n.language],
	);

	return (
		<div
			{...props}
			className={classNames('overflow-hidden border rounded-1', className)}
		>
			<Table responsive borderless striped variant='white' className='mb-0'>
				<tbody>
					{variables[type].map((variable, index) => (
						<TableRow key={index} variable={variable} />
					))}
				</tbody>
			</Table>
		</div>
	);
}

export default VariablesTable;
