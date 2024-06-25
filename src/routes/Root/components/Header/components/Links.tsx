import React, {
	ReactElement,
	ReactNode,
	CSSProperties,
	HTMLAttributes,
	memo,
	useId,
} from 'react';

import classNames from 'classnames';
import { motion } from 'framer-motion';
import {
	Link,
	LinkProps as BaseLinkProps,
	useLocation,
	useNavigation,
} from 'react-router-dom';

import { reverse } from 'routes';

export type LinksProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export interface LinkProps extends BaseLinkProps {
	children: ReactNode;
}

const linkUnderlineStyle: CSSProperties = { height: '2px' };

const links: LinkProps[] = [
	{ to: reverse('instruction'), children: gettext('Инструкция') },
	{ to: reverse('updates'), children: gettext('Обновления') },
	{ to: reverse('privacy-policy'), children: gettext('Конфиденциальность') },
	{ to: reverse('donation-index'), children: gettext('Пожертвование') },
];

function Links({ className, ...props }: LinksProps): ReactElement<LinksProps> {
	const id = useId();

	const location = useLocation();
	const navigation = useNavigation();

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
