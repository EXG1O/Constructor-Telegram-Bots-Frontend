import React, { ReactElement, HTMLAttributes } from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import VariableDisplay from './components/VariableDisplay';

import { Type } from '../..';

export interface VariableListProps extends HTMLAttributes<HTMLDivElement> {
	type: Type;
}

export interface Variable {
	name: string;
	description: string;
}

const variables: Record<Type, Variable[]> = {
	personal: [
		{ name: 'USER_ID', description: gettext('ID пользователя') },
		{ name: 'USER_USERNAME', description: gettext('@username пользователя') },
		{ name: 'USER_FIRST_NAME', description: gettext('Имя пользователя') },
		{ name: 'USER_LAST_NAME', description: gettext('Фамилия пользователя') },
		{ name: 'USER_FULL_NAME', description: gettext('Имя и фамилия пользователя') },
		{ name: 'USER_LANGUAGE_CODE', description: gettext('Языковой тег пользователя') },
		{ name: 'USER_MESSAGE_ID', description: gettext('ID сообщения пользователя') },
		{ name: 'USER_MESSAGE_TEXT', description: gettext('Текст сообщения пользователя') },
		{ name: 'USER_MESSAGE_DATE', description: gettext('Дата отправки сообщения пользователя') },
	],
	global: [
		{ name: 'BOT_NAME', description: gettext('Название бота') },
		{ name: 'BOT_USERNAME', description: gettext('@username бота') },
	],
}

function VariableList({ type, className, ...props }: VariableListProps): ReactElement<VariableListProps> {
	return (
		<div {...props} className={classNames('overflow-hidden border rounded-1', className)}>
			<Table responsive borderless striped className='mb-0'>
				<tbody>
					{variables[type].map((variable, index) => (
						<VariableDisplay key={index} variable={variable} />
					))}
				</tbody>
			</Table>
		</div>
	);
}

export default VariableList;