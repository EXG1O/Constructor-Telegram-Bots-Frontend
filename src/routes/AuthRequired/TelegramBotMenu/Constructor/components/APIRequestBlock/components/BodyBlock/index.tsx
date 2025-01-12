import React, { HTMLAttributes, memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import Collapse from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';
import FormMonacoEditorFeedback from 'components/FormMonacoEditorFeedback';

import BlockCollapse from './components/BlockCollapse';

export type Body = string;

export type BodyBlockProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

export const defaultBody: Body = JSON.stringify({ key: 'value' }, undefined, 4);

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function BodyBlock(props: BodyBlockProps): ReactElement<BodyBlockProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock.bodyBlock',
	});

	const [{ value: show }, _meta, { setValue }] = useField<boolean>(
		'show_api_request_body_block',
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

	function handleClick(): void {
		setValue(!show);
	}

	return (
		<BlockCollapse>
			<div {...props}>
				<Button
					size='sm'
					{...(show ? hideButtonProps : showButtonProps)}
					onClick={handleClick}
				/>
				<Collapse in={show}>
					<div>
						<FormMonacoEditorFeedback
							size='sm'
							language='json'
							name='api_request.body'
							options={monacoOptions}
							className='border-top-0 rounded-top-0'
						/>
					</div>
				</Collapse>
			</div>
		</BlockCollapse>
	);
}

export default memo(BodyBlock);
