import React, { ReactElement, useEffect } from 'react';
import { Params, NavigateOptions, useNavigate, useRouteLoaderData } from 'react-router-dom';

import Loading from 'components/Loading';
import { MessageToastProps } from 'components/MessageToast';

import useToast from 'services/hooks/useToast';

import { UserAPI } from 'services/api/users/main';

export type LoaderData = Pick<MessageToastProps, 'message' | 'level'>;

export async function loader({ params }: { params: Params<'userID' | 'confirmCode'> }): Promise<LoaderData> {
	const { userID, confirmCode } = params;

	if (userID && confirmCode) {
		const response = await UserAPI.login({
			user_id: Number.parseInt(userID),
			confirm_code: confirmCode,
		});

		if (response.ok) {
			return {
				message: gettext('Успешная авторизация.'),
				level: 'success',
			}
		} else if (response.status === 404) {
			return {
				message: gettext('Пользователь не найден!'),
				level: 'error',
			}
		} else if (response.status === 401) {
			return {
				message: gettext('Неверный код подтверждения!'),
				level: 'error',
			}
		}
	}

	return {
		message: gettext('Не удалось пройти авторизацию!'),
		level: 'error',
	}
}

function Login(): ReactElement {
	const navigate = useNavigate();
	const { message, level } = useRouteLoaderData('login') as LoaderData;

	const { createMessageToast } = useToast();

	useEffect(() => {
		const options: NavigateOptions = { replace: true };

		if (level === 'success') {
			navigate('/personal-cabinet/', options);
		} else {
			navigate('/', options);
		}

		createMessageToast({ message, level });
	}, []);

	return <Loading size='lg' className='m-auto' />;
}

export default Login;