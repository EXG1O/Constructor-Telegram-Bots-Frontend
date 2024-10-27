import React, { CSSProperties, memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import formatDate from 'i18n/formatDate';

import Row from 'react-bootstrap/Row';

import Block, { BlockProps } from 'components/Block';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

export type DonationsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

const baseStyle: CSSProperties = { height: '324px' };
const wrapperStyle: CSSProperties = { ...baseStyle, scrollbarWidth: 'thin' };

function Donations({
	className,
	...props
}: DonationsProps): ReactElement<DonationsProps> {
	const { t } = useTranslation('home', { keyPrefix: 'donations' });

	const { donations } = useHomeRouteLoaderData();

	return (
		<Block
			{...props}
			variant='dark'
			gradient
			className={classNames(className, 'text-center')}
		>
			<h3 className='fw-semibold mb-3'>{t('title')}</h3>
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
								<span>{formatDate(donation.date)}</span>
							</React.Fragment>
						))}
					</Row>
				</div>
			) : (
				<div style={baseStyle}>{t('noDonations')}</div>
			)}
		</Block>
	);
}

export default memo(Donations);
