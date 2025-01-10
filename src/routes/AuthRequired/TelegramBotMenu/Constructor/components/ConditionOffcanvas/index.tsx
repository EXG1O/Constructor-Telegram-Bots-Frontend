import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/Button';
import Offcanvas, { OffcanvasProps } from 'components/Offcanvas';
import Stack from 'components/Stack';

import PartsBlock from './components/PartsBlock';
import StoreProvider from './providers/StoreProvider';

import NameBlock from '../NameBlock';

import useConditionOffcanvasStore from './hooks/useConditionOffcanvasStore';

export type ConditionFormOffcanvasProps = Omit<
	OffcanvasProps,
	'show' | 'children' | 'onHide'
>;

function ConditionOffcanvas(
	props: ConditionFormOffcanvasProps,
): ReactElement<ConditionFormOffcanvasProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'conditionOffcanvas',
	});

	const store = useConditionOffcanvasStore();

	const type = useConditionOffcanvasStore((state) => state.type);
	const show = useConditionOffcanvasStore((state) => state.show);
	const loading = useConditionOffcanvasStore((state) => state.loading);

	const add = useConditionOffcanvasStore((state) => state.add);
	const save = useConditionOffcanvasStore((state) => state.save);
	const hide = useConditionOffcanvasStore((state) => state.hide);

	return (
		<Offcanvas {...props} show={show} loading={loading} onHide={hide}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>{t('title', { context: type })}</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body as={Stack} gap={3}>
				<NameBlock store={store} />
				<PartsBlock />
			</Offcanvas.Body>
			<Offcanvas.Footer className='gap-2'>
				<Button variant='success' onClick={type === 'add' ? add : save}>
					{t('actionButton', { context: type })}
				</Button>
			</Offcanvas.Footer>
		</Offcanvas>
	);
}

export default Object.assign(ConditionOffcanvas, { StoreProvider });
