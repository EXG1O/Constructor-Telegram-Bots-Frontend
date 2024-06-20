import React, { ReactElement } from 'react';

import Page from 'components/Page';

const title: string = gettext('Спасибо за пожертвование');

function Completed(): ReactElement {
	return (
		<Page title={title} align='center' grid className='text-center'>
			<h1 className='fw-semibold'>{title}</h1>
			<p className='lead'>
				{gettext(
					'Ваше пожертвование сильно поможет развитию и улучшению проекта.',
				)}
				<br />
				{gettext(
					'Если вы хотите узнать, было ли ваше пожертвование получено, ' +
						'то напишите основателю проекта.',
				)}
			</p>
		</Page>
	);
}

export default Completed;
