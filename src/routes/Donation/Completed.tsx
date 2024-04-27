import React, { ReactElement } from 'react';

import Container from 'react-bootstrap/Container';

import Title from 'components/Title';

const title: string = gettext('Спасибо за пожертвование');

function Completed(): ReactElement {
	return (
		<Title title={title}>
			<main className='my-auto'>
				<Container className='my-3 my-lg-4'>
					<h1 className='fw-semibold mb-1'>{title}</h1>
					<p className='lead mb-0'>
						{gettext('Ваше пожертвование сильно поможет развитию и улучшению проекта.')} <br />
						{gettext('Если вы хотите узнать, было ли ваше пожертвование получено, то напишите основателю проекта.')}
					</p>
				</Container>
			</main>
		</Title>
	);
}

export default Completed;