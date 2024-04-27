import React, { ReactElement } from 'react';

import Container from 'react-bootstrap/Container';

import Title from 'components/Title';

const title: string = gettext('Ошибка');

function ErrorBoundary(): ReactElement {
	return (
		<Title title={title}>
			<main className='my-auto'>
				<Container className='text-center my-3 my-lg-4'>
					<h1 className='fw-semibold mb-1'>{title}</h1>
					<p className='lead mb-0'>
						{gettext('Проверьте ваше интернет-подключение или попробуйте перезагрузить страницу.')} <br />
						{gettext('Если ничего не помогло, свяжитесь с основателем проекта.')}
					</p>
				</Container>
			</main>
		</Title>
	);
}

export default ErrorBoundary;