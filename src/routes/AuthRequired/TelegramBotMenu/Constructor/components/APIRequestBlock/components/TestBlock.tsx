import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { APIRequest } from '..';

import Collapse from 'react-bootstrap/Collapse';

import Button from 'components/Button';
import { createMessageToast } from 'components/ToastContainer';

export type TestBlockProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

interface Result {
	status: number;
	body: string;
}

const statusMarkerStyle: CSSProperties = {
	width: '14px',
	height: '14px',
	borderRadius: '50%',
};

function TestBlock(props: TestBlockProps): ReactElement<TestBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock.testBlock',
	});

	const [
		{
			value: { url, method, headers, body },
		},
	] = useField<APIRequest>('api_request');

	const [result, setResult] = useState<Result | null>(null);

	async function handleClick(): Promise<void> {
		if (!url) {
			createMessageToast({
				message: t('messages.makeTest.error', { context: 'emptyURL' }),
				level: 'error',
			});
			return;
		}

		try {
			new URL(url);
		} catch {
			createMessageToast({
				message: t('messages.makeTest.error', { context: 'validURL' }),
				level: 'error',
			});
			return;
		}

		try {
			const response = await fetch(url, {
				method,
				headers: headers.map<[string, string]>((header) => [
					header.key,
					header.value,
				]),
				body: method !== 'get' ? body : undefined,
			});

			setResult({ status: response.status, body: await response.text() });
		} catch {
			createMessageToast({
				message: t('messages.makeTest.error'),
				level: 'error',
			});
		}
	}

	return (
		<div {...props}>
			<Button
				size='sm'
				variant='dark'
				className={classNames('w-100', {
					'border-bottom-0 rounded-bottom-0': result,
				})}
				onClick={handleClick}
			>
				{t('testButton')}
			</Button>
			<Collapse in={Boolean(result)}>
				<div>
					{result && (
						<div className='border border-top-0 rounded-1 rounded-top-0 py-1 px-2'>
							<div className='d-flex gap-1'>
								<div
									className={classNames('align-self-center', {
										'bg-success': result.status <= 399,
										'bg-danger': result.status >= 400,
									})}
									style={statusMarkerStyle}
								/>
								{result.status}
							</div>
							<div className='text-break mb-0'>{result.body}</div>
						</div>
					)}
				</div>
			</Collapse>
		</div>
	);
}

export default memo(TestBlock);
