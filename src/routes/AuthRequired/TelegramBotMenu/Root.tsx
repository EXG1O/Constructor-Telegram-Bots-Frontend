import React, { ReactElement } from 'react';
import { Outlet, Params, redirect } from 'react-router-dom';

import { reverse } from 'routes';

import Container from 'react-bootstrap/Container';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

export interface LoaderData {
	telegramBot: APIResponse.TelegramBotAPI.Get;
}

export async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<Response | LoaderData> {
	const { telegramBotID } = params;

	if (telegramBotID === undefined) {
		return redirect(reverse('personal-cabinet'));
	}

	const response = await TelegramBotAPI.get(parseInt(telegramBotID));

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { telegramBot: response.json };
}

function Root(): ReactElement {
	return (
		<Container as='main' className='vstack gap-3 gap-lg-4 my-2 my-lg-3'>
			<Outlet />
		</Container>
	);
}

export default Root;
