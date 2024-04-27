import React, { ReactElement } from 'react';
import { Link, useRouteLoaderData } from 'react-router-dom';

import './Donations.scss';

import Stack from 'react-bootstrap/Stack';
import Table from 'react-bootstrap/Table';

import { LoaderData as HomeLoaderData } from '..';

function Donations(): ReactElement {
	const { donations } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<Stack gap={2} className='donations align-self-center'>
			<h3 className='mb-0'>{gettext('Список пожертвований')}</h3>
			<div className='border rounded'>
				<Table
					responsive
					striped
					borderless
					className='overflow-hidden align-middle rounded mb-0'
				>
					<thead className='border-bottom'>
						<tr>
							<th scope='col' style={{ width: '30%' }}>{gettext('Сумма')}</th>
							<th scope='col' style={{ width: '40%' }}>Telegram</th>
							<th scope='col' style={{ width: '30%' }}>{gettext('Дата')}</th>
						</tr>
					</thead>
					<tbody>
						{donations.count ? (
							donations.results.map(donation => (
								<tr key={donation.id}>
									<td>{donation.sum}€</td>
									<td>
										<a
											className='link-dark link-underline-opacity-0'
											href={donation.contact_link}
											target='_blank'
										>
											{donation.contact_link}
										</a>
									</td>
									<td>{donation.date}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3}>{gettext('Ещё не было сделано пожертвований')}</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
			<Link
				to='/donation/'
				className='btn btn-success align-self-center'
			>
				{gettext('Поддержать разработчика')}
			</Link>
		</Stack>
	);
}

export default Donations;