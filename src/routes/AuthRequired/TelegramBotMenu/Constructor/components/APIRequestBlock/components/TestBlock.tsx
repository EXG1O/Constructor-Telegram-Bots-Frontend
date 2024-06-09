import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useState,
} from 'react';
import classNames from 'classnames';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import useToast from 'services/hooks/useToast';

import useAPIRequestBlockStore from '../hooks/useAPIRequestBlockStore';

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
	const { createMessageToast } = useToast();

	const store = useAPIRequestBlockStore();

	const [result, setResult] = useState<Result | null>(null);

	async function handleClick(): Promise<void> {
		const {
			apiRequest: { url, method, headers, body },
		} = store.getState();

		if (!url) {
			createMessageToast({
				message: gettext('Введите URL-адрес.'),
				level: 'error',
			});
			return;
		}

		try {
			new URL(url);
		} catch {
			createMessageToast({
				message: gettext('Введите правильный URL-адрес.'),
				level: 'error',
			});
			return;
		}

		try {
			const response = await fetch(url, {
				method,
				headers: headers.map((header) => [header.key, header.value]),
				body: method !== 'get' ? body : undefined,
			});

			setResult({ status: response.status, body: await response.text() });
		} catch {
			createMessageToast({
				message: gettext('Произошла ошибка во время отправки API-запроса.'),
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
				{gettext('Протестировать')}
			</Button>
			<Collapse in={Boolean(result)} unmountOnExit>
				<div>
					<div className='border border-top-0 rounded-1 rounded-top-0 py-1 px-2'>
						{result && (
							<>
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
							</>
						)}
					</div>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(TestBlock);
