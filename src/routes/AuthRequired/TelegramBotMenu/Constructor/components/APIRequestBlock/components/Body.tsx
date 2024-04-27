import React, { ReactElement, memo } from 'react'

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import MonacoEditor from 'components/MonacoEditor';

export type Value = string;

export interface BodyProps {
	show: boolean;
	value?: Value;
	onShow: () => void;
	onHide: () => void;
	onChange: (value?: Value) => void;
}

function Body({ show, value, onShow, onHide, onChange }: BodyProps): ReactElement<BodyProps> {
	return (
		<div>
			<Button
				size='sm'
				{...(
					show ? {
						variant: 'secondary',
						className: 'w-100 border-bottom-0 rounded-bottom-0',
						children: gettext('Убрать данные'),
					} : {
						variant: 'dark',
						className: 'w-100',
						children: gettext('Добавить данные'),
					}
				)}
				aria-controls='command-offcanvas-api-request-body-addon'
				aria-expanded={show}
				onClick={show ? onHide : onShow}
			/>
			<Collapse
				in={show}
				unmountOnExit
				onExited={() => onChange(undefined)}
			>
				<div id='command-offcanvas-api-request-body-addon'>
					<MonacoEditor
						value={value ?? JSON.stringify({ key: 'value' }, undefined, 4)}
						defaultLanguage='json'
						options={{
							glyphMargin: false,
							folding: false,
							lineNumbers: 'off',
							lineDecorationsWidth: 0,
							lineNumbersMinChars: 0,
						}}
						className='border-top-0 rounded-1 rounded-top-0'
						onChange={(editor, newValue) => onChange(newValue)}
					/>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(Body);