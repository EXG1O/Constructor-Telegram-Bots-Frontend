import React, { ReactElement, HTMLAttributes, CSSProperties, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import Row from 'react-bootstrap/Row';

import { LoaderData as HomeLoaderData } from '..';

export type DonationsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const wrapperStyle: CSSProperties = { height: '324px', scrollbarWidth: 'thin' };

function Donations({
	className,
	...props
}: DonationsProps): ReactElement<DonationsProps> {
	const { donations } = useRouteLoaderData('home') as HomeLoaderData;

	return (
		<div
			{...props}
			className={classNames(
				'text-center text-bg-dark bg-gradient rounded-4 p-3',
				className,
			)}
		>
			<h3 className='fw-semibold mb-3'>{gettext('Пожертвования')}</h3>
			<div className='overflow-auto' style={wrapperStyle}>
				<Row xs={3} className='mx-0'>
					{donations.results.map((donation) => (
						<React.Fragment key={donation.id}>
							<span>{`${donation.sum}€`}</span>
							<span>
								<a
									className='text-white text-decoration-none'
									href={donation.contact_link}
									target='_blank'
								>
									{donation.contact_link}
								</a>
							</span>
							<span>{donation.date}</span>
						</React.Fragment>
					))}
				</Row>
			</div>
		</div>
	);
}

export default memo(Donations);
