import React, {
	FC,
	HTMLAttributes,
	memo,
	ReactElement,
	SVGProps,
	useMemo,
	useState,
} from 'react';
import classNames from 'classnames';

import useTelegramBot from '../hooks/useTelegramBot';

import EyeIcon from 'assets/icons/eye.svg';
import EyeSlashIcon from 'assets/icons/eye-slash.svg';
import PencilSquareIcon from 'assets/icons/pencil-square.svg';

export interface APITokenDisplayProps
	extends Pick<HTMLAttributes<HTMLElement>, 'className'> {
	onEdit: () => void;
}

const iconProps: SVGProps<SVGSVGElement> = { width: 18, height: 18, cursor: 'pointer' };

function APITokenDisplay({
	className,
	onEdit,
	...props
}: APITokenDisplayProps): ReactElement<APITokenDisplayProps> {
	const [telegramBot] = useTelegramBot();

	const [show, setShow] = useState<boolean>(false);

	const ShowIcon = useMemo<FC<SVGProps<SVGSVGElement>>>(
		() => (show ? EyeSlashIcon : EyeIcon),
		[show],
	);
	const hiddenAPIToken = useMemo<string>(() => {
		const [id, token] = telegramBot.api_token.split(':');
		return id + ':' + '*'.repeat(token.length);
	}, [telegramBot.api_token]);

	return (
		<div
			{...props}
			className={classNames('d-flex align-items-center gap-2', className)}
		>
			<span className='flex-fill text-break'>
				{show ? telegramBot.api_token : hiddenAPIToken}
			</span>
			<div className='d-flex gap-2'>
				<ShowIcon {...iconProps} onClick={() => setShow(!show)} />
				<PencilSquareIcon
					{...iconProps}
					className='text-secondary'
					onClick={onEdit}
				/>
			</div>
		</div>
	);
}

export default memo(APITokenDisplay);
