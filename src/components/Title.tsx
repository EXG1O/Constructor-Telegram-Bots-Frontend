import { ReactNode, useEffect } from 'react';

export interface TitleProps {
	title: string;
	children: ReactNode;
}

function Title({ title, children }: TitleProps): ReactNode {
	useEffect(() => { document.title = `${title} - Constructor Telegram Bots` }, []);

	return children;
}

export default Title;