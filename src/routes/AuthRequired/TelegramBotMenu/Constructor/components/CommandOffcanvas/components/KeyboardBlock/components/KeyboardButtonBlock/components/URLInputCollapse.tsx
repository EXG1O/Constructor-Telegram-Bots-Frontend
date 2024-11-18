import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type URLInputCollapseProps = Omit<CollapseProps, 'in'>;

function URLInputCollapse({
	children,
	...props
}: URLInputCollapseProps): ReactElement<URLInputCollapseProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix:
			'commandOffcanvas.keyboardBlock.keyboardButtonBlock.urlInputCollapse',
	});

	const keyboardType = useCommandOffcanvasStore((state) => state.keyboard.type);

	const show = useCommandOffcanvasStore((state) => state.showKeyboardButtonURLInput);
	const setShow = useCommandOffcanvasStore(
		(state) => state.setShowKeyboardButtonURLInput,
	);

	const showButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'dark',
			className: 'w-100 mt-2',
			children: t('showButton'),
		}),
		[i18n.language],
	);
	const hideButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'secondary',
			className: 'w-100 border-bottom-0 rounded rounded-bottom-0 mt-2',
			children: t('hideButton'),
		}),
		[i18n.language],
	);

	return (
		<div>
			<Collapse in={keyboardType !== 'default'}>
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
			</Collapse>
		</div>
	);
}

export default memo(URLInputCollapse);
