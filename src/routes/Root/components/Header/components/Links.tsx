import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	ReactNode,
	useId,
	useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
	Link,
	LinkProps as BaseLinkProps,
	useLocation,
	useNavigation,
} from 'react-router-dom';
import classNames from 'classnames';
import { motion } from 'framer-motion';

import { reverse, RouteID } from 'routes';

export type LinksProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export interface LinkProps extends BaseLinkProps {
	children: ReactNode;
}

const linkUnderlineStyle: CSSProperties = { height: '2px' };

function Links({ className, ...props }: LinksProps): ReactElement<LinksProps> {
	const id = useId();

	const { t, i18n } = useTranslation(RouteID.Root, { keyPrefix: 'links' });

	const location = useLocation();
	const navigation = useNavigation();

	const links = useMemo<LinkProps[]>(
		() => [
			{ to: reverse(RouteID.Instruction), children: t('instruction') },
			{ to: reverse(RouteID.Updates), children: t('updates') },
			{ to: reverse(RouteID.PrivacyPolicy), children: t('privacyPolicy') },
			{ to: reverse(RouteID.Donation), children: t('donation') },
		],
		[i18n.language],
	);

	return (
		<div {...props} className={classNames('d-flex', className)}>
			{links.map(({ className, ...props }, index) => {
				const active: boolean = navigation.location
					? navigation.location.pathname === props.to
					: location.pathname === props.to;

				return (
					<div key={index}>
						<Link
							{...props}
							className={classNames(
								'd-block text-reset text-decoration-none p-2 pb-1',
								className,
							)}
						/>
						{active && (
							<motion.div
								layoutId={id}
								className='bg-dark'
								style={linkUnderlineStyle}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default memo(Links);
