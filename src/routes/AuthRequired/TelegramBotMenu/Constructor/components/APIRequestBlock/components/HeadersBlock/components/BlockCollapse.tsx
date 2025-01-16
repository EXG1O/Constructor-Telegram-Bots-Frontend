import React, { HTMLAttributes, memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Collapse from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

export type BlockCollapseProps = Pick<
	HTMLAttributes<HTMLDivElement>,
	'className' | 'children'
>;

function BlockCollapse({
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock.headersBlock',
	});

	const [{ value: show }, _meta, { setValue }] = useField(
		'show_api_request_headers_block',
	);

	const showButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'dark',
			className: 'w-100',
			children: t('showButton'),
		}),
		[i18n.language],
	);
	const hideButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'secondary',
			className: 'w-100 border-bottom-0 rounded-bottom-0',
			children: t('hideButton'),
		}),
		[i18n.language],
	);

	function handleClick() {
		setValue(!show);
	}

	return (
		<div {...props}>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={handleClick}
			/>
			<Collapse in={show}>
				<div>{children}</div>
			</Collapse>
		</div>
	);
}

export default memo(BlockCollapse);
