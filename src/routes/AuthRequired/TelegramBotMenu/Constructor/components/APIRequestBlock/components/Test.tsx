import React, { ReactElement, memo, useState } from 'react'
import classNames from 'classnames';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Stack from 'react-bootstrap/Stack';

import MonacoEditor from 'components/MonacoEditor';

import useToast from 'services/hooks/useToast';

export interface TestProps {
	url: string;
	data: RequestInit;
}

interface Result {
	status: number;
	json?: Record<string, any>;
}

function Test({ url, data }: TestProps): ReactElement<TestProps> {
	const { createMessageToast } = useToast();

	const [result, setResult] = useState<Result | undefined>(undefined);

	async function handleMakeTestAPIRequestButtonClick(): Promise<void> {
		if (!url) {
			createMessageToast({
				message: gettext('Введите URL-адрес!'),
				level: 'error',
			});
			return;
		}

		try {
			new URL(url);
		} catch {
			createMessageToast({
				message: gettext('Введите правильный URL-адрес!'),
				level: 'error',
			});
			return;
		}

		try {
			const response = await fetch(url, data);

			let json: Record<string, any> | undefined;

			try {
				json = await response.json();
			} catch {
				json = undefined;
			}

			setResult({ status: response.status, json });
		} catch {
			createMessageToast({
				message: gettext('Произошла ошибка во время отправки API-запроса!'),
				level: 'error',
			});
		}
	}

	return (
		<div>
			<Button
				size='sm'
				variant='dark'
				className={classNames('w-100', result && 'border-bottom-0 rounded-bottom-0')}
				onClick={handleMakeTestAPIRequestButtonClick}
			>
				{gettext('Протестировать')}
			</Button>
			<Collapse in={Boolean(result)} unmountOnExit>
				<div className='command-offcanvas-api-request-test-result'>
					<Stack gap={1} className='border border-top-0 rounded-1 rounded-top-0 p-1'>
						{result && (
							<>
								<div className='d-flex gap-1'>
									<div
										className={`align-self-center bg-${result.status <= 399 ? 'success' : 'danger'}`}
										style={{ width: '14px', height: '14px', borderRadius: '50%' }}
									/>
									{result.status}
								</div>
								{result.json && (
									<MonacoEditor
										disablePadding
										disableFocusEffect
										value={JSON.stringify(result.json, undefined, 4)}
										defaultLanguage='json'
										options={{
											readOnly: true,
											domReadOnly: true,
											glyphMargin: false,
											folding: false,
											lineNumbers: 'off',
											lineDecorationsWidth: 0,
											lineNumbersMinChars: 0,
										}}
										className='border-0 rounded-0'
									/>
								)}
							</>
						)}
					</Stack>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(Test);