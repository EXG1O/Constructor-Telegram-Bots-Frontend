import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import { LoaderData as HomeLoaderData } from '..';

import Row from 'react-bootstrap/Row';

export type DonationsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const baseStyle: CSSProperties = { height: '324px' };
const wrapperStyle: CSSProperties = { ...baseStyle, scrollbarWidth: 'thin' };

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
			{donations.count ? (
				<div className='overflow-auto' style={wrapperStyle}>
					<Row xs={3} className='mx-0'>
						{donations.results.map((donation) => (
							<React.Fragment key={donation.id}>
								<span>{`${donation.sum}€`}</span>
								<span>
									<a
										href={donation.contact_link}
										rel='noreferrer'
										target='_blank'
										className='text-white text-decoration-none'
									>
										{donation.contact_link}
									</a>
								</span>
								<span>{donation.date}</span>
							</React.Fragment>
						))}
					</Row>
				</div>
			) : (
				<div style={baseStyle}>
					{gettext('Ещё не было сделано пожертвований')}
				</div>
			)}
		</div>
	);
}

export default memo(Donations);
