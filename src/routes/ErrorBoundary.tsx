import React, { ReactElement } from 'react';

import Page from 'components/Page';

const title: string = gettext('Ошибка');

function ErrorBoundary(): ReactElement {
	return (
		<Page title={title} align='center' className='text-center'>
			<h1 className='fw-bold'>{title}</h1>
			<p className='fs-5'>
				{gettext(
					'Проверьте ваше интернет-подключение или ' +
						'попробуйте перезагрузить страницу.',
				)}
				<br />
				{gettext('Если ничего не помогло, свяжитесь с основателем проекта.')}
			</p>
		</Page>
	);
}

export default ErrorBoundary;
