import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type DescriptionInputCollapseProps = Omit<CollapseProps, 'in'>;

function DescriptionInputCollapse({
	children,
	...props
}: DescriptionInputCollapseProps): ReactElement<DescriptionInputCollapseProps> {
	const { t, i18n } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.triggerBlock.descriptionInputCollapse',
	});

	const show = useCommandOffcanvasStore((state) => state.showTriggerDescriptionInput);
	const setShow = useCommandOffcanvasStore(
		(state) => state.setShowTriggerDescriptionInput,
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
			className: 'w-100 border-bottom-0 rounded rounded-bottom-0',
			children: t('hideButton'),
		}),
		[i18n.language],
	);

	return (
		<div>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={() => setShow(!show)}
			/>
			<Collapse {...props} in={show}>
				<div>{children}</div>
			</Collapse>
		</div>
	);
}

export default memo(DescriptionInputCollapse);
