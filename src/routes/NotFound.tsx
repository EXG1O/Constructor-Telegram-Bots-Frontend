import React, { ReactElement, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Loading from 'components/Loading';

import useToast from 'services/hooks/useToast';

function NotFound(): ReactElement {
	const navigate = useNavigate();

	const { createMessageToast } = useToast();

	useEffect(() => {
		navigate('/', { replace: true });
		createMessageToast({
			message: gettext('Страница не найдена!'),
			level: 'error',
		});
	});

	return <Loading size='lg' className='m-auto' />;
}

export default NotFound;