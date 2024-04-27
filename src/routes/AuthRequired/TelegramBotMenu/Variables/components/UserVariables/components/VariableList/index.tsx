import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import Loading from 'components/Loading';

import Block, { BlockProps } from './components/Block';
import VariableDisplay from './components/VariableDisplay';

import useVariables from '../../hooks/useVariables';
import VariableContext from './contexts/VariableContext';

export interface VariableListProps extends Omit<BlockProps, 'children'> {
	loading: boolean;
}

function VariableList({ loading, className, ...props }: VariableListProps): ReactElement<VariableListProps> {
	const { variables, filter } = useVariables();

	return (
		!loading ? (
			variables.length ? (
				<Block {...props} className={classNames('overflow-hidden', className)}>
					<Table responsive striped borderless className='align-middle mb-0'>
						<tbody>
							{variables.map(variable => (
								<VariableContext.Provider
									key={variable.id}
									value={{ variable }}
								>
									<VariableDisplay />
								</VariableContext.Provider>
							))}
						</tbody>
					</Table>
				</Block>
			) : filter.search ? (
				<Block className='text-center px-3 py-2'>
					{gettext('Не найдены переменные по поиску')}
				</Block>
			) : (
				<Block className='text-center px-3 py-2'>
					{gettext('Вы ещё не добавили переменные')}
				</Block>
			)
		) : (
			<Block className='d-flex justify-content-center p-3'>
				<Loading size='md' />
			</Block>
		)
	);
}

export default memo(VariableList);