import React, { HTMLAttributes, memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonProps } from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import BlockCollapse from './components/BlockCollapse';
import BodyEditor from './components/BodyEditor';

import useAPIRequestBlockStore from '../../hooks/useAPIRequestBlockStore';

export type Body = string;

export type BodyBlockProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 4);

function BodyBlock(props: BodyBlockProps): ReactElement<BodyBlockProps> {
	const { t, i18n } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'apiRequestBlock.bodyBlock',
	});

	const show = useAPIRequestBlockStore((state) => state.showAPIRequestBodyBlock);
	const setShow = useAPIRequestBlockStore(
		(state) => state.setShowAPIRequestBodyBlock,
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
		<BlockCollapse>
			<div {...props}>
				<Button
					size='sm'
					{...(show ? hideButtonProps : showButtonProps)}
					onClick={() => setShow(!show)}
				/>
				<Collapse in={show}>
					<div>
						<BodyEditor className='border-top-0 rounded-top-0' />
					</div>
				</Collapse>
			</div>
		</BlockCollapse>
	);
}

export default memo(BodyBlock);
