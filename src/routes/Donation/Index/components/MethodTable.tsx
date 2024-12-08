import React, { memo, ReactElement } from 'react';

import Table from 'components/Table';

import MethodTableRow from './MethodTableRow';

import useDonationRouteLoaderData from '../hooks/useDonationRouteLoaderData';

function MethodTable(): ReactElement {
	const { methods } = useDonationRouteLoaderData();

	return (
		<div className='text-bg-white border rounded-1'>
			<Table
				responsive
				striped
				borderless
				className='align-middle text-nowrap mb-0'
			>
				<tbody>
					{methods.map((method, index) => (
						<MethodTableRow key={index} method={method} />
					))}
				</tbody>
			</Table>
		</div>
	);
}

export default memo(MethodTable);
