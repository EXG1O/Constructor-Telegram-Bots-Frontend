import React, { HTMLAttributes, memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export type BlockCollapseProps = Omit<CollapseProps, 'in'> &
	Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function BlockCollapse({
	mountOnEnter,
	unmountOnExit,
	appear,
	timeout,
	dimension,
	getDimensionValue,
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock.headersBlock',
	});

	const show = useAPIRequestBlockStore((state) => state.showAPIRequestHeadersBlock);
	const setShow = useAPIRequestBlockStore(
		(state) => state.setShowAPIRequestHeadersBlock,
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

	return (
		<div {...props}>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={() => setShow(!show)}
			/>
			<Collapse
				in={show}
				mountOnEnter={mountOnEnter}
				unmountOnExit={unmountOnExit}
				appear={appear}
				timeout={timeout}
				dimension={dimension}
				getDimensionValue={getDimensionValue}
			>
				<div>{children}</div>
			</Collapse>
		</div>
	);
}

export default memo(BlockCollapse);
